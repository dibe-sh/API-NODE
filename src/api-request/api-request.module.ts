import { Module } from '@nestjs/common';
import { APIRequestService } from './api-request.service';

@Module({
  providers: [APIRequestService],
  exports: [APIRequestService],
})
export class APIRequestModule {}
