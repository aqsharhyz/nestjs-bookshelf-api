import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { Auth } from 'src/common/auth.decorator';
import {
  CommentResponse,
  CreateCommentRequest,
  UpdateCommentRequest,
} from 'src/model/comment.model';
import { WebResponse } from 'src/model/web.model';
import { CommentService } from './comment.service';
import { User } from '@prisma/client';

@Controller('api/books/:bookId/comments')
export class CommentController {
  constructor(private commentService: CommentService) {}

  @Post()
  @HttpCode(200)
  async post(
    @Auth() user: User,
    @Param('bookId', ParseIntPipe) bookId: number,
    @Body() request: CreateCommentRequest,
  ): Promise<WebResponse<CommentResponse>> {
    const comment = await this.commentService.post(user, bookId, request);
    return {
      data: comment,
    };
  }

  @Get()
  @HttpCode(200)
  async get(
    @Auth() user: User,
    @Param('bookId', ParseIntPipe) bookId: number,
  ): Promise<WebResponse<CommentResponse[]>> {
    const comments = await this.commentService.getAll(user, bookId);
    return {
      data: comments,
    };
  }

  @Get('/:commentId')
  @HttpCode(200)
  async getOne(
    @Auth() user: User,
    @Param('bookId', ParseIntPipe) bookId: number,
    @Param('commentId', ParseIntPipe) commentId: number,
  ): Promise<WebResponse<CommentResponse>> {
    const comment = await this.commentService.getOne(user, bookId, commentId);
    return {
      data: comment,
    };
  }

  @Patch('/:commentId')
  @HttpCode(200)
  async update(
    @Auth() user: User,
    @Param('bookId', ParseIntPipe) bookId: number,
    @Param('commentId', ParseIntPipe) commentId: number,
    @Body() request: UpdateCommentRequest,
  ): Promise<WebResponse<CommentResponse>> {
    const comment = await this.commentService.update(
      user,
      bookId,
      commentId,
      request,
    );
    return {
      data: comment,
    };
  }

  @Delete('/:commentId')
  @HttpCode(200)
  async remove(
    @Auth() user: User,
    @Param('bookId', ParseIntPipe) bookId: number,
    @Param('commentId', ParseIntPipe) commentId: number,
  ): Promise<WebResponse<boolean>> {
    await this.commentService.remove(user, bookId, commentId);
    return {
      data: true,
    };
  }
}
