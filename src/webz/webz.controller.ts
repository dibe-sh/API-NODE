import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { WebzService } from './webz.service';
import { WebzCallbackData } from './interfaces/webz-options.interface';
import { CreatePostDto } from './dto/create-post.dto';
import { logger } from '../logger/winston.config';

// Default query for time being
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
    const callback = (data: WebzCallbackData) => {
      //  Perform Call back action as required
      logger.info(
        `DATA : ${data.received} posts received and ${data.remaining} posts remaining`,
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
