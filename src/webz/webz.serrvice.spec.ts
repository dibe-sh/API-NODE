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
      facebook: { likes: 0, comments: 0, shares: 0 },
      vk: { shares: 0 },
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

describe('WebzService', () => {
  let service: WebzService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    $transaction: jest.fn().mockImplementation((cb) => cb(mockPrismaService)),
    thread: {
      upsert: jest.fn().mockResolvedValue({ id: 'mock-thread-id' }),
      create: jest.fn().mockResolvedValue({ id: 'mock-thread-id' }),
    },
    post: {
      findUnique: jest.fn(),
      create: jest.fn().mockResolvedValue({ id: 'mock-post-id' }),
      update: jest.fn().mockResolvedValue({ id: 'mock-post-id' }),
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

  describe('prepareThreadCreateData and prepareThreadUpdateData', () => {
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

    it('should correctly transform thread data for creation', () => {
      const result = service['prepareThreadCreateData'](thread);

      expect(result.published).toBeInstanceOf(Date);
      expect(result.social?.create?.vk_shares).toEqual(5);
      expect(result.social?.create?.facebook?.create?.likes).toEqual(10);
    });

    it('should correctly transform thread data for update', () => {
      const result = service['prepareThreadUpdateData'](thread);

      expect(result.published).toBeInstanceOf(Date);
      expect(result.social?.update?.vk_shares).toEqual(5);
      expect(result.social?.update?.facebook?.update?.likes).toEqual(10);
    });
  });

  describe('createPost', () => {
    it('should create a new post when it does not exist', async () => {
      mockPrismaService.post.findUnique.mockResolvedValueOnce(null);

      await service.createPost(createPostDto);

      expect(prismaService.thread.upsert).toHaveBeenCalled();
      expect(prismaService.post.findUnique).toHaveBeenCalledWith({
        where: { uuid: createPostDto.uuid },
        include: {
          entities: true,
          external_links: true,
          external_images: true,
          syndication: true,
        },
      });
      expect(prismaService.post.create).toHaveBeenCalled();
      expect(prismaService.post.update).not.toHaveBeenCalled();
    });

    it('should update an existing post when it exists', async () => {
      const existingPost = {
        id: 'existing-id',
        uuid: createPostDto.uuid,
        entities: [],
        external_links: [],
        external_images: [],
        syndication: null,
      };

      mockPrismaService.post.findUnique.mockResolvedValueOnce(existingPost);

      await service.createPost(createPostDto);
      expect(prismaService.thread.upsert).toHaveBeenCalled();
      expect(prismaService.post.update).toHaveBeenCalled();
      expect(prismaService.post.create).toHaveBeenCalled();
    });
  });

  describe('storeBatch', () => {
    it('should handle batch processing errors and logging', async () => {
      const posts = [createPostDto];
      const requestId = 'test-request';
      const mockError = new Error('Test Error');

      mockPrismaService.$transaction.mockImplementationOnce(() => {
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
        'Completed batch storage',
        expect.anything(),
      );
    });

    it('should successfully process and log batch creation', async () => {
      const posts = [createPostDto];
      const requestId = 'test-request';

      mockPrismaService.post.findUnique.mockResolvedValue(null);

      await service['storeBatch'](posts, requestId);

      expect(logger.info).toHaveBeenCalledWith('Starting batch storage', {
        requestId,
        postCount: posts.length,
      });

      expect(logger.info).toHaveBeenCalledWith('Completed batch storage', {
        requestId,
        postCount: posts.length,
      });
    });
  });

  describe('bulkFetchAndStore', () => {
    it('should initiate fetching and storing process', async () => {
      const result = await service.bulkFetchAndStore({
        queryString: 'site_type:(news OR blogs) is_first:true',
      });

      expect(result).toBe('Fetch request initiated');
    });

    it('should handle callback during fetch and store', async () => {
      const mockCallback = jest.fn();

      await service.bulkFetchAndStore(
        {
          queryString: 'test query',
        },
        mockCallback,
      );

      expect(logger.info).toHaveBeenCalledWith(
        'Starting post fetch operation',
        expect.any(Object),
      );
    });
  });
});
