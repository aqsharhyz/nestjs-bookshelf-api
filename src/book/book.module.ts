import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { CommentModule } from 'src/comment/comment.module';

@Module({
  imports: [CommentModule],
  controllers: [BookController],
  providers: [BookService],
})
export class BookModule {}
