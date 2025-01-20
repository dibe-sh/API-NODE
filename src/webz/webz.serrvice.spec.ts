import { Test, TestingModule } from '@nestjs/testing';
import { WebzService } from './webz.service';
import { PrismaService } from '../prisma/prisma.service';
import { APIRequestService } from '../api-request/api-request.service';
import { CreatePostDto, Thread } from './dto/create-post.dto';
import { logger } from '../logger/winston.config';

jest.mock('../logger/winston.config');

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
  text: "Gold prices trade steady amid rebound in dollar index, US bond yield; silver nears Rs 91,200/ kg\nGold prices in Wednesday's session (January 8) were up by a tad amid a stronger dollar and yields after the latest U.S.",
  highlightText: '',
  highlightTitle: '',
  highlightThreadTitle: '',
  language: 'english',
  sentiment: 'neutral',
  categories: ['Economy, Business and Finance'],
  topics: ['Economy, Business and Finance->macro economics'],
  ai_allow: true,
  has_canonical: false,
  webz_reporter: false,
  external_links: [
    'https://www.facebook.com/Zeebusinessonline/',
    'https://twitter.com/zeebusiness',
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

const thread: Thread = {
  uuid: 'random-uuid',
  url: 'www.dibe.sh',
  site_full: 'site_full',
  site: 'dibe.sh',
  site_section: 'site_section',
  section_title: 'section_title',
  title: 'title',
  title_full: 'title_full',
  replies_count: 12,
  participants_count: 12,
  site_type: 'news',
  country: 'NP',
  main_image: 'main_image',
  performance_score: 0,
  domain_rank: 15976,
  domain_rank_updated: new Date('2023-12-01T00:00:00Z'),
  published: new Date('2023-12-01T00:00:00Z'),
  social: {
    vk: { shares: 5 },
    facebook: { likes: 10, comments: 2, shares: 1 },
  },
};

describe('WebzService', () => {
  let service: WebzService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    $transaction: jest.fn().mockImplementation((cb) => cb({})),
    thread: {
      create: jest.fn().mockResolvedValue({ id: 'mock-thread-id' }),
    },
    post: {
      create: jest.fn().mockResolvedValue({ id: 'mock-post-id' }),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WebzService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: APIRequestService,
          useValue: {
            makeApiRequest: jest.fn(),
            buildInitialUrl: jest.fn(),
            getNextUrl: jest.fn(),
            sleep: jest.fn().mockResolvedValue(true),
            formatError: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<WebzService>(WebzService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('prepareThreadData', () => {
    it('should correctly transform thread data', () => {
      const result = service['prepareThreadData'](thread);

      expect(result.published).toBeInstanceOf(Date);
      expect(result.social.create.vk_shares).toEqual(5);
    });
  });

  describe('createPost', () => {
    it('should create a thread and post', async () => {
      (prismaService.$transaction as jest.Mock).mockImplementationOnce(
        async (callback) => {
          return callback(prismaService);
        },
      );
      (prismaService.thread.create as jest.Mock).mockResolvedValueOnce({
        uuid: '1c2af264ac6cc5381d3f6147260023e781dddb67',
      });
      (prismaService.post.create as jest.Mock).mockResolvedValueOnce({
        uuid: '1c2af264ac6cc5381d3f6147260023e781dddb67',
      });

      const result = await service.createPost(createPostDto);

      expect(prismaService.thread.create).toHaveBeenCalled();
      expect(prismaService.post.create).toHaveBeenCalled();
      expect(result.uuid).toEqual('1c2af264ac6cc5381d3f6147260023e781dddb67');
    });
  });

  describe('fetchAndStore', () => {
    it('should initiate fetching and storing', async () => {
      service['bulkFetchAndStore']({
        queryString:
          'site_type:(news OR blogs) is_first:true gold$ AND metal AND (trade$ OR volatility$ OR fund$ OR funds$) AND (market$ OR asset$ OR futures OR exchange) AND (forecast OR commodity OR "gold$ price$") AND (traders$ OR trading$ OR equity OR etf OR etfs OR portfolio) title:gold',
      });

      jest
        .spyOn(service, 'bulkFetchAndStore')
        .mockResolvedValue('Fetch request initiated');
    });
  });

  describe('storeBatch', () => {
    it('should log and rethrow errors encountered during batch processing', async () => {
      const posts = [{}] as any[];
      const requestId = 'test-request';
      const mockError = new Error('Test Error');

      (prismaService.$transaction as jest.Mock).mockImplementationOnce(() => {
        throw mockError;
      });

      await expect(service['storeBatch'](posts, requestId)).rejects.toThrow(
        'Test Error',
      );

      expect(logger.error).toHaveBeenCalledWith('Error storing batch', {
        requestId,
        error: undefined,
      });

      expect(logger.info).not.toHaveBeenCalledWith(
        `Completed batch storage`,
        expect.anything(),
      );
    });
  });
});
