import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  ParseIntPipe,
  Query,
  ParseBoolPipe,
} from '@nestjs/common';
import { BookService } from './book.service';
import { Auth } from '../common/auth.decorator';
import {
  BookResponse,
  CreateBookRequest,
  SearchBookRequest,
  SimpleSearchBookRequest,
  UpdateBookRequest,
} from './book.model';
import { WebResponse } from '../common/web.model';
import { User } from '@prisma/client';

@Controller('/api/books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  @HttpCode(200)
  async create(
    @Auth() user: User,
    @Body() request: CreateBookRequest,
  ): Promise<WebResponse<BookResponse>> {
    const book = await this.bookService.create(user, request);
    return {
      data: book,
    };
  }

  @Get()
  @HttpCode(200)
  async getAll(
    @Auth() user: User,
    @Query('title') title?: string,
    @Query('author') author?: string,
    @Query('publisher') publisher?: string,
    @Query('year', new ParseIntPipe({ optional: true })) year?: number,
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('size', new ParseIntPipe({ optional: true })) size: number = 10,
    @Query('isFinished', new ParseBoolPipe({ optional: true }))
    isFinished?: boolean,
  ): Promise<WebResponse<BookResponse[]>> {
    const request: SearchBookRequest = {
      title: title,
      author: author,
      publisher: publisher,
      year: year,
      page: page,
      size: size,
      isFinished: isFinished,
    };
    return await this.bookService.getAll(user, request);
  }

  @Get('/search')
  @HttpCode(200)
  async search(
    @Auth() user: User,
    @Query('q') q: string,
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
  ): Promise<WebResponse<BookResponse[]>> {
    const request: SimpleSearchBookRequest = {
      search: q,
      page,
    };
    return await this.bookService.search(user, request);
  }

  @Get('/:id')
  @HttpCode(200)
  async get(
    @Auth() user: User,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<WebResponse<BookResponse>> {
    const result = await this.bookService.getOne(user, id);
    return {
      data: result,
    };
  }

  @Patch('/:id')
  @HttpCode(200)
  async update(
    @Auth() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body() request: UpdateBookRequest,
  ): Promise<WebResponse<BookResponse>> {
    request.id = id;
    const result = await this.bookService.update(user, request);
    return {
      data: result,
    };
  }

  @Delete('/:id')
  @HttpCode(200)
  async remove(
    @Auth() user: User,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<WebResponse<BookResponse>> {
    const result = await this.bookService.remove(user, id);
    return {
      data: result,
    };
  }
}
