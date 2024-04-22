import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import {
  BookResponse,
  CreateBookRequest,
  SearchBookRequest,
  SimpleSearchBookRequest,
  UpdateBookRequest,
} from './book.model';
import { Logger } from 'winston';
import { User, Book } from '@prisma/client';
import { BookValidation } from './book.validation';
import { WebResponse } from '../common/web.model';
import { CommentService } from '../comment/comment.service';
import { CategoryService } from 'src/category/category.service';
@Injectable()
export class BookService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
    private validationService: ValidationService,
    private commentService: CommentService,
    private categoryService: CategoryService,
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
      throw new HttpException('Book already exists', HttpStatus.CONFLICT);
    }

    if (
      !(await this.categoryService.checkIfCategoryExist(
        createRequest.categoryName,
      ))
    ) {
      throw new HttpException('Category is not found', HttpStatus.BAD_REQUEST);
    }

    createRequest.categoryName = await this.categoryService.getCategoryId(
      createRequest.categoryName,
    );

    const book = await this.prismaService.book.create({
      data: { username: user.username, ...createRequest },
    });

    return this.toBookResponse(book, user);
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
      // select: {
      //   id: true,
      //   title: true,
      //   author: true,
      //   year: true,
      //   publisher: true,
      //   isFinished: true,
      //   username: false,
      // },
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
      data: await Promise.all(
        books.map(async (book) => await this.toBookResponse(book, user, false)),
      ),
    };
  }

  async search(
    user: User,
    request: SimpleSearchBookRequest,
  ): Promise<WebResponse<BookResponse[]>> {
    this.logger.debug(
      `BookService.search(${user.username}, ${JSON.stringify(request)})`,
    );

    const searchRequest: SimpleSearchBookRequest =
      this.validationService.validate(BookValidation.SIMPLE_SEARCH, request);

    const filter = {
      username: user.username,
      OR: [
        {
          title: {
            contains: searchRequest.search,
          },
        },
        {
          author: {
            contains: searchRequest.search,
          },
        },
        {
          publisher: {
            contains: searchRequest.search,
          },
        },
      ],
    };

    const books = await this.prismaService.book.findMany({
      where: filter,
      take: 20,
      skip: (searchRequest.page - 1) * 20,
    });

    const total: number = await this.prismaService.book.count({
      where: filter,
    });

    return {
      paging: {
        size: books.length,
        current_page: searchRequest.page,
        total_page: Math.ceil(total / 20),
      },
      data: await Promise.all(
        books.map(async (book) => await this.toBookResponse(book, user, false)),
      ),
    };
  }

  async getOne(user: User, id: number): Promise<BookResponse> {
    this.logger.debug(`BookService.getOne(${user.username}, ${id})`);

    const book = await this.checkBookMustExists(user.username, id);

    return await this.toBookResponse(book, user, true);
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
      throw new HttpException(
        'Book with this title is already exists',
        HttpStatus.CONFLICT,
      );
    }

    if (updateRequest.categoryName) {
      if (
        !(await this.categoryService.checkIfCategoryExist(
          updateRequest.categoryName,
        ))
      ) {
        throw new HttpException(
          'Category is not found',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const updatedBook = await this.prismaService.book.update({
      where: {
        id: updateRequest.id,
      },
      data: updateRequest,
    });

    return await this.toBookResponse(updatedBook, user, false);
  }

  async remove(user: User, id: number): Promise<BookResponse> {
    await this.checkBookMustExists(user.username, id);

    const book = await this.prismaService.book.delete({
      where: {
        id,
      },
    });

    return await this.toBookResponse(book, user);
  }

  async checkBookMustExists(username: string, bookId: number): Promise<Book> {
    const book = await this.prismaService.book.findUnique({
      where: {
        id: bookId,
        username: username,
      },
    });

    if (!book) {
      throw new HttpException('Book is not found', HttpStatus.NOT_FOUND);
    }

    return book;
  }

  async toBookResponse(
    book: Book,
    user?: User,
    withComments: boolean = false,
  ): Promise<BookResponse> {
    return {
      id: book.id,
      title: book.title,
      author: book.author,
      publisher: book.publisher,
      year: book.year,
      isFinished: book.isFinished,
      categoryName: (await this.categoryService.getCategory(book.categoryName))
        .name,
      comments: withComments
        ? await this.commentService.getAll(user, book.id)
        : undefined,
    };
  }
}
