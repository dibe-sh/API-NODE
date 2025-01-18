import { Controller, Post, Body } from '@nestjs/common';
import { WebzService } from './webz.service';
import { CreatePostDto } from './dto/create-post.dto';

@Controller('webz')
export class WebzController {
  constructor(private readonly webzService: WebzService) {}

  @Post()
  create(@Body() createPostDto: CreatePostDto) {
    return this.webzService.createPost(createPostDto);
  }
}
