import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { WebzService } from './webz.service';
import { WebzController } from './webz.controller';
import { APIRequestModule } from '../api-request/api-request.module';

@Module({
  providers: [WebzService],
  controllers: [WebzController],
  imports: [PrismaModule, APIRequestModule],
})
export class WebzModule {}
