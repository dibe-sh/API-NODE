import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto, Thread } from './dto/create-post.dto';
import {
  WebzCallbackData,
  WebzFetchAndStore,
  WebzOptions,
} from './interfaces/webz-options.interface';
import { logger } from '../logger/winston.config';
import { WebzResponse } from './interfaces/webz-response.interface';
import { APIRequestService } from '../api-request/api-request.service';

@Injectable()
export class WebzService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly apiRequestService: APIRequestService,
  ) {}

  private prepareThreadData(thread: Thread) {
    return {
      ...thread,
      published: new Date(thread.published),
      domain_rank_updated: new Date(thread.domain_rank_updated),
      social: thread.social
        ? {
            create: {
              vk_shares: thread.social.vk.shares,
              facebook: thread.social.facebook
                ? {
                    create: {
                      likes: thread.social.facebook.likes,
                      comments: thread.social.facebook.comments,
                      shares: thread.social.facebook.shares,
                    },
                  }
                : undefined,
            },
          }
        : undefined,
    };
  }

  async createPost(createPostDto: CreatePostDto) {
    return await this.prisma.$transaction(async (prisma) => {
      const {
        thread,
        entities,
        external_links,
        external_images,
        syndication,
        ...postData
      } = createPostDto;

      // Handle Thread Upsert
      const threadRecord = await prisma.thread.create({
        data: this.prepareThreadData(thread),
      });

      // Mapping Issue: Thus Removing Objects and manually adding later
      delete postData.highlightText;
      delete postData.highlightThreadTitle;
      delete postData.highlightTitle;

      // Handle Post Creation
      const postRecord = await prisma.post.create({
        data: {
          ...postData,
          categories: postData.categories ?? [],
          topics: postData.topics ?? [],
          published: new Date(postData.published),
          crawled: new Date(postData.crawled),
          updated: new Date(postData.updated),
          threadId: threadRecord.id,
          highlight_text: createPostDto.highlightText,
          highlight_thread_title: createPostDto.highlightThreadTitle,
          highlight_title: createPostDto.highlightTitle,
          entities: {
            create: [
              ...(entities.persons?.map((person) => ({
                name: person.name,
                type: 'persons' as const,
                sentiment: person.sentiment,
              })) ?? []),
              ...(entities.organizations?.map((org) => ({
                name: org.name,
                type: 'organizations' as const,
                sentiment: org.sentiment,
              })) ?? []),
              ...(entities.locations?.map((location) => ({
                name: location.name,
                type: 'locations' as const,
                sentiment: location.sentiment,
              })) ?? []),
            ],
          },
          external_links: {
            create: external_links.map((link) => ({ url: link })) ?? [],
          },
          external_images: {
            create:
              external_images.map((image) => ({
                url: image.url,
                meta_info: image.meta_info,
                uuid: image.uuid,
                labels: image.label ?? [],
              })) ?? [],
          },
          syndication: {
            create: {
              syndicated: syndication.syndicated,
              syndicate_id: syndication.syndicate_id,
              first_syndicated: syndication.first_syndicated,
            },
          },
        },
        include: {
          thread: {
            include: {
              social: {
                include: {
                  facebook: true,
                },
              },
            },
          },
          entities: true,
          external_links: true,
          external_images: true,
          syndication: true,
        },
      });
      return postRecord;
    });
  }

  private async fetchAndStore(options: WebzFetchAndStore, requestId: string) {
    logger.debug('Fetch and Store initiated', { requestId });
    let nextUrl = this.apiRequestService.buildInitialUrl(options.queryString);
    let isMoreResultsAvailable = true;
    do {
      try {
        const response =
          await this.apiRequestService.makeApiRequest<WebzResponse>(
            nextUrl,
            requestId,
          );
        if (!response) {
          break;
        }

        const {
          posts,
          moreResultsAvailable,
          next,
          totalResults,
        }: WebzResponse = response;

        // Store Current post on batch
        // TODO: Handel Duplicate UUID and data request
        this.storeBatch(posts, requestId);

        // Callback Execution if provided
        if (options.callback) {
          options.callback({
            received: posts.length,
            remaining: totalResults,
          });
        }

        //  If more results are available fetch next using iteration
        isMoreResultsAvailable = moreResultsAvailable > 0;
        nextUrl = this.apiRequestService.getNextUrl(next);

        // Rate Limiting request
        await this.apiRequestService.sleep(1000);
      } catch (error) {
        logger.error('Fetch Error', {
          requestId,
          error: this.apiRequestService.formatError(error),
        });
        continue;
      }
    } while (isMoreResultsAvailable);
  }

  async bulkFetchAndStore(
    options: WebzOptions,
    callback?: (data: WebzCallbackData) => void,
  ) {
    // Unique identifier for request made
    const requestId = Math.random().toString(36).substring(7);
    logger.info('Starting post fetch operation', { requestId });

    this.fetchAndStore({ ...options, callback }, requestId).catch((error) => {
      logger.error('Error in fetch operation', {
        requestId,
        error: this.apiRequestService.formatError(error),
      });
      throw error;
    });

    return 'Fetch request initiated';
  }

  private async storeBatch(posts: CreatePostDto[], requestId: string) {
    logger.info(`Starting batch storage`, {
      requestId,
      postCount: posts.length,
    });
    try {
      for (const post of posts) {
        await this.prisma.$transaction(async () => {
          await this.createPost(post);
        });
      }

      logger.info(`Completed batch storage`, {
        requestId,
        postCount: posts.length,
      });
    } catch (error) {
      logger.error('Error storing batch', {
        requestId,
        error: this.apiRequestService.formatError(error),
      });
      throw error;
    }
  }
}
