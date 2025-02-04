import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosError } from 'axios';
import { logger } from '../logger/winston.config';

@Injectable()
export class APIRequestService {
  private readonly api_token: string;
  private readonly base_url: string;
  private readonly batch_size: number;

  constructor(private readonly configService: ConfigService) {
    this.api_token = this.configService.get<string>('WEBZIO_TOKEN');
    this.base_url = this.configService.get<string>('WEBZIO_BASE_URL');
    this.batch_size =
      this.configService.get<number>('WEBZIO_BATCH_SIZE') ?? 100;
  }

  private shouldRetry(error: any): boolean {
    if (error instanceof AxiosError) {
      // Retry on rate limits or temporary server errors
      return [429, 502, 503, 504].includes(error.response?.status ?? 0);
    }
    return false;
  }

  sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  formatError(error: any) {
    if (error instanceof AxiosError) {
      return {
        message: error.message,
        status: error.response?.status,
      };
    }
    return error;
  }

  buildInitialUrl(queryString: string): string {
    const baseUrl = `${this.base_url}/filterWebContent?token=${this.api_token}&size=${this.batch_size}`;
    return queryString ? `${baseUrl}&q=${queryString}` : baseUrl;
  }

  getNextUrl(nextUrl: string): string {
    const baseUrl = `${this.base_url}`;
    return nextUrl
      ? `${baseUrl}${decodeURI(nextUrl)}&size=${this.batch_size}`
      : baseUrl;
  }

  async makeApiRequest<T>(url: string, requestId: string) {
    logger.info('Making API request', { requestId, url });
    try {
      const response = await axios.get<T>(url);
      return response.data;
    } catch (error) {
      logger.error('Making API request', {
        requestId,
        error: this.formatError(error),
      });
      if (this.shouldRetry(error)) {
        logger.warn('Retrying failed request', {
          requestId,
          error: this.formatError(error),
        });
        await this.sleep(2000);
        return this.makeApiRequest(url, requestId);
      }
      throw error;
    }
  }
}
