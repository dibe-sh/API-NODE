import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto, Thread } from './dto/create-post.dto';
import { WebzOptions } from './interfaces/webz-options.interface';
import { logger } from '../logger/winston.config';
import { WebzResponse } from './interfaces/webz-response.interface';
import { APIRequestService } from '../api-request/api-request.service';

@Injectable()
export class WebzService {
  private readonly logger = new Logger(WebzService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly apiRequestService: APIRequestService,
  ) {}

  private prepareThreadData(thread: Thread) {
    return {
      url: thread.url,
      site_full: thread.site_full,
      site: thread.site,
      site_section: thread.site_section,
      site_categories: thread.site_categories,
      section_title: thread.section_title,
      title: thread.title,
      title_full: thread.title_full,
      published: new Date(thread.published),
      replies_count: thread.replies_count,
      participants_count: thread.participants_count,
      site_type: thread.site_type,
      country: thread.country,
      main_image: thread.main_image,
      performance_score: thread.performance_score,
      domain_rank: thread.domain_rank,
      domain_rank_updated: new Date(thread.domain_rank_updated),
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

      const createSocial = {
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
      };

      const threadData = this.prepareThreadData(thread);

      // Handle Thread Upsert
      const threadRecord = await prisma.thread.upsert({
        where: { uuid: thread.uuid },
        create: {
          uuid: thread.uuid,
          social: thread.social
            ? {
                create: createSocial,
              }
            : undefined,
          ...threadData,
        },
        update: {
          social: thread.social
            ? {
                upsert: {
                  create: createSocial,
                  update: {
                    vk_shares: thread.social.vk.shares,
                    facebook: thread.social.facebook
                      ? {
                          upsert: {
                            create: {
                              likes: thread.social.facebook.likes,
                              comments: thread.social.facebook.comments,
                              shares: thread.social.facebook.shares,
                            },
                            update: {
                              likes: thread.social.facebook.likes,
                              comments: thread.social.facebook.comments,
                              shares: thread.social.facebook.shares,
                            },
                          },
                        }
                      : undefined,
                  },
                },
              }
            : undefined,
          ...threadData,
        },
      });

      // Mapping Issue: Thus Removing Objects and manually adding later
      delete postData.highlightText;
      delete postData.highlightThreadTitle;
      delete postData.highlightTitle;

      // Handle Post Creation
      const postRecord = await prisma.post.create({
        data: {
          ...postData,
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
            create: external_links.map((link) => ({ url: link })),
          },
          external_images: {
            create: external_images.map((image) => ({
              url: image.url,
              meta_info: image.meta_info,
              uuid: image.uuid,
              labels: image.label,
            })),
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

  async fetchAndStore(options: WebzOptions, requestId: string) {
    let nextUrl = this.apiRequestService.buildInitialUrl(options.queryString);
    let isMoreResultsAvailable = true;
    do {
      const response =
        await this.apiRequestService.makeApiRequest<WebzResponse>(
          nextUrl,
          requestId,
        );
      if (!response) {
        break;
      }

      const { posts, moreResultsAvailable, next, totalResults }: WebzResponse =
        response;

      // Store Current post on batch
      // this.storeBatch(posts, requestId);

      // Callback Execution if provided
      if (options.callback) {
        options.callback({
          received: posts.length,
          remaining: totalResults,
        });
      }

      //  If more results are available fetch next using iteration
      isMoreResultsAvailable = moreResultsAvailable > 0;
      nextUrl = next;

      // Rate Limiting request
      await this.apiRequestService.sleep(1000);
    } while (isMoreResultsAvailable);
  }

  async bulkFetchAndStore(options: WebzOptions) {
    // Unique identifier for request made
    const requestId = Math.random().toString(36).substring(7);
    logger.info('Starting post fetch operation', { requestId });

    this.fetchAndStore(options, requestId).catch((error) => {
      logger.error('Error in fetch operation', {
        requestId,
        error: this.apiRequestService.formatError(error),
      });
      throw error;
    });

    return 'Fetch request initiated';
  }

  private async storeBatch(posts: CreatePostDto[], requestId: string) {
    try {
      logger.info(`Starting batch storage`, {
        requestId,
        postCount: posts.length,
      });

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
