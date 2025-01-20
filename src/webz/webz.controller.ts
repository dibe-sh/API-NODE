import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { WebzService } from './webz.service';
import { WebzCallbackData } from './interfaces/webz-options.interface';
import { CreatePostDto } from './dto/create-post.dto';
import { logger } from '../logger/winston.config';

// Default query for time being: REMOVE IT IN FUTURE
const query = `site_type:(news OR blogs) is_first:true gold$ AND metal AND (trade$ OR volatility$ OR fund$ OR funds$) AND (market$ OR asset$ OR futures OR exchange) AND (forecast OR commodity OR "gold$ price$") AND (traders$ OR trading$ OR equity OR etf OR etfs OR portfolio) title:gold`;

@Controller('webz')
export class WebzController {
  constructor(private readonly webzService: WebzService) {}

  @Post()
  create(@Body() createPostDto: CreatePostDto) {
    return this.webzService.createPost(createPostDto);
  }

  @Get('fetch')
  async fetchPosts(@Query('query') queryString) {
    const requestId = Math.random().toString(36).substring(7);
    const callback = (data: WebzCallbackData) => {
      const remaining = data.remaining - data.received;
      //  Perform Call back action as required
      logger.info(
        `DATA : ${data.received} posts received and ${remaining} posts remaining`,
        { requestId },
      );
    };
    return this.webzService.bulkFetchAndStore(
      {
        queryString: queryString ?? query,
      },
      callback,
    );
  }
}
