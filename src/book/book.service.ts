import { HttpException, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import {
  BookResponse,
  CreateBookRequest,
  SearchBookRequest,
  UpdateBookRequest,
} from 'src/model/book.model';
import { Logger } from 'winston';
import { User, Book } from '@prisma/client';
import { BookValidation } from './book.validation';
import { WebResponse } from 'src/model/web.model';
@Injectable()
export class BookService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
    private validationService: ValidationService,
  ) {}

  async create(user: User, request: CreateBookRequest): Promise<BookResponse> {
    this.logger.debug(
      `BookService.create(${user.username}, ${JSON.stringify(request)})`,
    );

    const createRequest: CreateBookRequest = this.validationService.validate(
      BookValidation.CREATE,
      request,
    );

    const ifBookExists = await this.prismaService.book.count({
      where: {
        username: user.username,
        title: createRequest.title,
      },
    });

    if (ifBookExists != 0) {
      throw new HttpException('Book already exists', 400);
    }

    const book = await this.prismaService.book.create({
      data: { username: user.username, ...createRequest },
    });

    return book;
  }

  async getAll(
    user: User,
    request: SearchBookRequest,
  ): Promise<WebResponse<BookResponse[]>> {
    this.logger.debug(
      `BookService.getAll(${user.username}, ${JSON.stringify(request)})`,
    );

    const searchRequest: SearchBookRequest = this.validationService.validate(
      BookValidation.SEARCH,
      request,
    );

    const filters = [];

    if (searchRequest.title) {
      filters.push({
        title: {
          contains: searchRequest.title,
        },
      });
    }

    if (searchRequest.author) {
      filters.push({
        author: {
          contains: searchRequest.author,
        },
      });
    }

    if (searchRequest.isFinished !== undefined) {
      filters.push({
        isFinished: {
          equals: searchRequest.isFinished,
        },
      });
    }

    if (searchRequest.year) {
      filters.push({
        year: {
          equals: searchRequest.year,
        },
      });
    }

    console.log(filters);

    const skip = (searchRequest.page - 1) * searchRequest.size;

    const books = await this.prismaService.book.findMany({
      where: {
        username: user.username,
        AND: filters,
      },
      take: searchRequest.size,
      skip,
      select: {
        id: true,
        title: true,
        author: true,
        year: true,
        publisher: true,
        isFinished: true,
        username: false,
      },
    });

    const total = await this.prismaService.book.count({
      where: {
        username: user.username,
        AND: filters,
      },
    });

    return {
      paging: {
        size: books.length,
        current_page: searchRequest.page,
        total_page: Math.ceil(total / searchRequest.size),
      },
      data: books.map((book) => book),
    };
  }

  async getOne(user: User, id: number): Promise<BookResponse> {
    this.logger.debug(`BookService.getOne(${user.username}, ${id})`);

    const book = await this.checkBookMustExists(user.username, id);

    return book;
  }

  async update(user: User, request: UpdateBookRequest): Promise<BookResponse> {
    this.logger.debug(
      `BookService.update(${JSON.stringify(user)}, ${JSON.stringify(request)})`,
    );

    const updateRequest: UpdateBookRequest = this.validationService.validate(
      BookValidation.UPDATE,
      request,
    );

    await this.checkBookMustExists(user.username, updateRequest.id);

    const ifBookExists = await this.prismaService.book.count({
      where: {
        username: user.username,
        title: updateRequest.title,
        id: {
          not: updateRequest.id,
        },
      },
    });

    if (ifBookExists != 0) {
      throw new HttpException('Book with this title is already exists', 400);
    }

    const updatedBook = await this.prismaService.book.update({
      where: {
        id: updateRequest.id,
      },
      data: updateRequest,
    });

    return updatedBook;
  }

  async remove(user: User, id: number): Promise<BookResponse> {
    await this.checkBookMustExists(user.username, id);

    const book = await this.prismaService.book.delete({
      where: {
        id,
      },
    });

    return book;
  }

  async checkBookMustExists(username: string, bookId: number): Promise<Book> {
    const book = await this.prismaService.book.findUnique({
      where: {
        id: bookId,
        username: username,
      },
    });

    if (!book) {
      throw new HttpException('Book is not found', 404);
    }

    return book;
  }
}
