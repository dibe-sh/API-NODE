import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class WebzService {
  private readonly logger = new Logger(WebzService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createPost(createPostDto: CreatePostDto) {
    try {
      return await this.prisma.$transaction(async (prisma) => {
        const {
          thread,
          entities,
          external_links,
          external_images,
          syndication,
          ...postData
        } = createPostDto;

        if (!thread) {
          this.logger.error('Thread is missing or invalid', thread);
          throw new Error(
            'The "thread" property is missing in the provided DTO.',
          );
        }

        // Handle Thread Upsert
        const threadRecord = await prisma.thread.upsert({
          where: { uuid: thread.uuid },
          update: {
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
            social: thread.social
              ? {
                  upsert: {
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
          },
          create: {
            uuid: thread.uuid,
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
          },
        });

        if (!threadRecord?.id) {
          this.logger.error('Failed to create or update thread', threadRecord);
          throw new Error('Thread record creation failed');
        }

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
    } catch (error) {
      this.logger.error('Error creating post', error);
      throw error;
    }
  }
}
