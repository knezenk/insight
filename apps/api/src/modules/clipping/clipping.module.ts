import { Module } from '@nestjs/common';
import { ClippingController } from './clipping.controller';
import { ClippingService } from './clipping.service';

@Module({
  controllers: [ClippingController],
  providers: [ClippingService],
  exports: [ClippingService],
})
export class ClippingModule {}
