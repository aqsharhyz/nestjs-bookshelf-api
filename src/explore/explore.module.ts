import { Module } from '@nestjs/common';
import { ExploreService } from './explore.service';

@Module({
  providers: [ExploreService]
})
export class ExploreModule {}
