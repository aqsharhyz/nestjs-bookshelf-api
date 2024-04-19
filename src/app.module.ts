import { Module } from '@nestjs/common';
import { BookModule } from './book/book.module';
import { UserModule } from './user/user.module';
import { CommonModule } from './common/common.module';
import { AdminController } from './admin/admin.controller';
import { AdminService } from './admin/admin.service';
import { AdminModule } from './admin/admin.module';
import { CommentService } from './comment/comment.service';
import { CommentController } from './comment/comment.controller';
import { CommentModule } from './comment/comment.module';
import { ExploreController } from './explore/explore.controller';
import { ExploreModule } from './explore/explore.module';

@Module({
  imports: [CommonModule, BookModule, UserModule, AdminModule, CommentModule, ExploreModule],
  controllers: [AdminController, CommentController, ExploreController],
  providers: [AdminService, CommentService],
})
export class AppModule {}
