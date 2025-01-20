import { Test, TestingModule } from '@nestjs/testing';
import { APIRequestService } from './api-request.service';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosError } from 'axios';
import { logger } from '../logger/winston.config';

jest.mock('axios');
jest.mock('../logger/winston.config');

describe('APIRequestService', () => {
  let service: APIRequestService;

  const mockConfigService = {
    get: jest.fn((key: string) => {
      const config = {
        WEBZIO_TOKEN: 'test-token',
        WEBZIO_BASE_URL: 'https://api.example.com',
        WEBZIO_BATCH_SIZE: 100,
      };
      return config[key];
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        APIRequestService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<APIRequestService>(APIRequestService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('buildInitialUrl', () => {
    it('should build the correct URL with query string', () => {
      const result = service.buildInitialUrl('test-query');
      expect(result).toBe(
        `https://api.example.com/filterWebContent?token=test-token&size=${mockConfigService.get('WEBZIO_BATCH_SIZE')}&q=test-query`,
      );
    });

    it('should build the correct URL without query string', () => {
      const result = service.buildInitialUrl('');
      expect(result).toBe(
        `https://api.example.com/filterWebContent?token=test-token&size=${mockConfigService.get('WEBZIO_BATCH_SIZE')}`,
      );
    });
  });

  describe('getNextUrl', () => {
    it('should return the full next URL when provided', () => {
      const result = service.getNextUrl('/next-page');
      expect(result).toBe(
        `https://api.example.com/next-page&size=${mockConfigService.get('WEBZIO_BATCH_SIZE')}`,
      );
    });

    it('should return the base URL if no next URL is provided', () => {
      const result = service.getNextUrl('');
      expect(result).toBe('https://api.example.com');
    });
  });

  describe('formatError', () => {
    it('should format AxiosError correctly', () => {
      const axiosError = {
        message: 'Test error',
        status: 404,
      } as AxiosError;

      const result = service.formatError(axiosError);
      expect(result).toEqual({
        message: 'Test error',
        status: 404,
      });
    });

    it('should return non-AxiosError as is', () => {
      const error = new Error('General error');
      const result = service.formatError(error);
      expect(result).toEqual(error);
    });
  });

  describe('makeApiRequest', () => {
    it('should make a successful API request and return data', async () => {
      const mockResponse = { data: { success: true } };
      (axios.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await service.makeApiRequest(
        'https://api.example.com/test',
        'test-request',
      );
      expect(result).toEqual({ success: true });
      expect(logger.info).toHaveBeenCalledWith('Making API request', {
        requestId: 'test-request',
        url: 'https://api.example.com/test',
      });
    });
  });
});
