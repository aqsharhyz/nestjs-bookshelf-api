import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { CommentModule } from '../comment/comment.module';
import { CategoryModule } from '../category/category.module';

@Module({
  imports: [CommentModule, CategoryModule],
  controllers: [BookController],
  providers: [BookService],
})
export class BookModule {}
