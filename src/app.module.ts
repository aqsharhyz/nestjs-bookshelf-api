import { Module } from '@nestjs/common';
import { BookModule } from './book/book.module';
import { UserModule } from './user/user.module';
import { CommonModule } from './common/common.module';
import { AdminModule } from './admin/admin.module';
import { CommentModule } from './comment/comment.module';
import { ExploreModule } from './explore/explore.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [
    CommonModule,
    BookModule,
    UserModule,
    AdminModule,
    CommentModule,
    ExploreModule,
    CategoryModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
