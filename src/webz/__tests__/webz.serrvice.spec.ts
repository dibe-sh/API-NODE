import { Test, TestingModule } from '@nestjs/testing';
import { WebzService } from '../webz.service';
import { PrismaService } from '../../prisma/prisma.service';
import { APIRequestService } from '../../api-request/api-request.service';
import { CreatePostDto } from '../dto/create-post.dto';

describe('WebzService', () => {
  let webzService: WebzService;
  let prismaService: jest.Mocked<PrismaService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WebzService,
        {
          provide: PrismaService,
          useValue: {
            $transaction: jest.fn(),
            thread: {
              upsert: jest.fn(),
            },
            post: {
              create: jest.fn(),
            },
          },
        },
        {
          provide: APIRequestService,
          useValue: {
            buildInitialUrl: jest.fn(),
            makeApiRequest: jest.fn(),
            sleep: jest.fn(() => Promise.resolve()),
            formatError: jest.fn(),
          },
        },
      ],
    }).compile();

    webzService = module.get<WebzService>(WebzService);
    prismaService = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(webzService).toBeDefined();
  });

  describe('createPost', () => {
    it('should successfully create a post and thread', async () => {
      const createPostDto: CreatePostDto = {
        thread: {
          uuid: '1c2af264ac6cc5381d3f6147260023e781dddb67',
          url: 'https://www.zeebiz.com/markets/commodities/news-gold-price-gains-limited-on-rebound-in-dollar-us-treasury-yield-silver-price-tops-rs-91000-mcx-337812',
          site_full: 'www.zeebiz.com',
          site: 'zeebiz.com',
          site_section: 'https://www.zeebiz.com/markets/commodities',
          site_categories: ['media', 'financial_news', 'finance'],
          section_title:
            'Commodities News Today, Latest Commodities Market News, Gold Rate | NCDEX | MCX | Crude Oil | Zee Business',
          title:
            'Gold prices trade steady amid rebound in dollar index, US bond yield; silver nears Rs 91,200/ kg',
          title_full:
            'Gold prices trade steady amid rebound in dollar index, US bond yield; silver nears Rs 91,200/ kg',
          published: new Date('2025-01-08T10:12:00.000+02:00'),
          replies_count: 0,
          participants_count: 1,
          site_type: 'news',
          country: 'IN',
          main_image:
            'https://cdn.zeebiz.com/sites/default/files/2025/01/08/343623-bulbul-ahmed-kvowg1w2ztk-unsplash-1.jpg',
          performance_score: 0,
          domain_rank: 15976,
          domain_rank_updated: new Date('2025-01-13T23:00:00.000+02:00'),
          social: {
            facebook: {
              likes: 0,
              comments: 0,
              shares: 0,
            },
            vk: {
              shares: 0,
            },
          },
        },
        uuid: '1c2af264ac6cc5381d3f6147260023e781dddb67',
        url: 'https://www.zeebiz.com/markets/commodities/news-gold-price-gains-limited-on-rebound-in-dollar-us-treasury-yield-silver-price-tops-rs-91000-mcx-337812',
        ord_in_thread: 0,
        parent_url: null,
        author: '@ZeeBusiness',
        published: '2025-01-08T10:12:00.000+02:00',
        title:
          'Gold prices trade steady amid rebound in dollar index, US bond yield; silver nears Rs 91,200/ kg',
        text: "Gold prices trade steady amid rebound in dollar index, US bond yield; silver nears Rs 91,200/ kg\nGold prices in Wednesday's session (January 8) were up by a tad amid a stronger dollar and yields after the latest U.S. data hinted that the Federal Reserve may slow the pace of its rate cut cycle.\nPrecious metal prices: Gold prices in Wednesday's session (January 8) were up by a tad amid a stronger dollar and yields after the latest US jobs data hinted that the Federal Reserve may slow the pace of its rate cut cycle.\nAt 12:33 pm, Gold February futures on the MCX traded with gains of just 0.1 per cent or Rs 74 at Rs 77,605 per 10 gm, while silver March futures were up 0.14 per cent or Rs 131 at Rs 91,004 per kg.\nOn Tuesday, gold and silver were settled on a positive note in the international markets. Gold February futures contract settled at $2,665.40 per troy ounce, up by 0.68 per cent and silver March futures contract were settled at $30.686 per troy ounce, up by 0.34 per cent. The trend was followed in the domestic markets too, with Gold February futures contract settling at Rs 77,531 per 10 grams with a gain of 0.48 per cent and silver March futures contract settled at Rs 90,873 per kilogram with a gain of 0.35 per cent..",
        highlightText: '',
        highlightTitle: '',
        highlightThreadTitle: '',
        language: 'english',
        sentiment: 'neutral',
        categories: ['Economy, Business and Finance'],
        topics: [
          'Economy, Business and Finance->macro economics',
          'Economy, Business and Finance->financial and economic news',
          'Economy, Business and Finance->commodity market',
        ],
        ai_allow: true,
        has_canonical: false,
        webz_reporter: false,
        external_links: [
          'https://www.facebook.com/Zeebusinessonline/',
          'https://twitter.com/zeebusiness',
          'https://www.youtube.com/channel/UCkXopQ3ubd-rnXnStZqCl2w',
          'https://www.twitter.com/zeebusiness',
          'https://youtube.com/channel/UCkXopQ3ubd-rnXnStZqCl2w',
          'https://facebook.com/Zeebusinessonline/',
          'https://www.facebook.com/Zeebusinessonline',
        ],
        external_images: [],
        entities: {
          persons: [],
          organizations: [],
          locations: [],
        },
        syndication: {
          syndicated: false,
          syndicate_id: null,
          first_syndicated: false,
        },
        rating: null,
        crawled: new Date('2025-01-15T16:32:39.835+02:00'),
        updated: new Date('2025-01-15T16:32:39.835+02:00'),
      };

      (prismaService.$transaction as jest.Mock).mockImplementationOnce(
        async (callback) => {
          return callback(prismaService);
        },
      );

      (prismaService.thread.upsert as jest.Mock).mockResolvedValueOnce({
        id: 'thread-id',
      } as any);

      (prismaService.post.create as jest.Mock).mockResolvedValueOnce({
        id: 'post-id',
        title: 'Post Title',
      });

      const result = await webzService.createPost(createPostDto);

      expect(prismaService.thread.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { uuid: createPostDto.thread.uuid },
        }),
      );

      expect(prismaService.post.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            title: createPostDto.title,
          }),
        }),
      );

      expect(result).toEqual(
        expect.objectContaining({
          id: 'post-id',
          title: 'Post Title',
        }),
      );
    });
  });
});
