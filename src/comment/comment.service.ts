import { HttpException, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import {
  CommentResponse,
  CreateCommentRequest,
  UpdateCommentRequest,
} from 'src/model/comment.model';
import { Logger } from 'winston';
import { CommentValidation } from './comment.validation';
import { User, Book, Comment } from '@prisma/client';

@Injectable()
export class CommentService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
    private validationService: ValidationService,
  ) {}

  async post(
    user: User,
    bookId: number,
    request: CreateCommentRequest,
  ): Promise<CommentResponse> {
    this.logger.debug(
      `CommentService.post(${JSON.stringify(user)}, ${bookId}, ${JSON.stringify(request)})`,
    );

    const createRequest: CreateCommentRequest = this.validationService.validate(
      CommentValidation.POST,
      request,
    );

    await this.checkIfBookExists(user.username, bookId);

    const comment = await this.prismaService.comment.create({
      data: {
        ...createRequest,
        ...{ username: user.username, bookId: bookId },
      },
    });

    return this.toCommentResponse(comment);
  }

  async getAll(user: User, bookId: number): Promise<CommentResponse[]> {
    this.logger.debug(`CommentService.getAll(${user.username}, ${bookId})`);

    await this.checkIfBookExists(user.username, bookId);

    const comments = await this.prismaService.comment.findMany({
      where: {
        bookId,
      },
    });

    return Promise.all(
      comments.map(async (comment) => {
        return this.toCommentResponse(comment);
      }),
    );
  }

  async getOne(
    user: User,
    bookId: number,
    commentId: number,
  ): Promise<CommentResponse> {
    this.logger.debug(
      `CommentService.getOne(${user.username}, ${bookId}, ${commentId})`,
    );

    await this.checkIfCommentExists(user.username, bookId, commentId);

    const comment = await this.prismaService.comment.findFirst({
      where: {
        id: commentId,
      },
    });

    return this.toCommentResponse(comment);
  }

  async update(
    user: User,
    bookId: number,
    commentId: number,
    request: UpdateCommentRequest,
  ): Promise<CommentResponse> {
    this.logger.debug(
      `CommentService.updateComment(${user.username}, ${bookId}, ${commentId}, ${JSON.stringify(request)})`,
    );

    const updateRequest: UpdateCommentRequest = this.validationService.validate(
      CommentValidation.UPDATE,
      request,
    );

    await this.checkIfCommentExists(user.username, bookId, commentId);

    const comment = await this.prismaService.comment.update({
      where: {
        id: commentId,
      },
      data: {
        content: updateRequest.content,
      },
    });

    return this.toCommentResponse(comment);
  }

  async remove(user: User, bookId: number, commentId: number) {
    this.logger.debug(
      `CommentService.remove(${user.username}, ${bookId}, ${commentId})`,
    );

    await this.checkIfCommentExists(user.username, bookId, commentId);

    await this.prismaService.comment.delete({
      where: {
        id: commentId,
      },
    });
  }

  async checkIfBookExists(username: string, bookId: number): Promise<Book> {
    const book = await this.prismaService.book.findFirst({
      where: {
        id: bookId,
        username: username,
      },
    });

    if (!book) {
      throw new HttpException('Book not found', 404);
    }

    return book;
  }

  async checkIfCommentExists(
    username: string,
    bookId: number,
    commentId: number,
  ): Promise<Comment> {
    const comment = await this.prismaService.comment.findFirst({
      where: {
        id: commentId,
        bookId,
        username,
      },
    });

    if (!comment) {
      throw new HttpException('Comment not found', 404);
    }

    return comment;
  }

  async toCommentResponse(comment: Comment): Promise<CommentResponse> {
    return {
      bookId: comment.bookId,
      username: comment.username,
      content: comment.content,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    };
  }
}
