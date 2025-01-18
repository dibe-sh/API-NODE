import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { WebzService } from './webz.service';
import { WebzController } from './webz.controller';

@Module({
  providers: [WebzService],
  controllers: [WebzController],
  imports: [PrismaModule],
})
export class WebzModule {}
