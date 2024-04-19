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
} from '@nestjs/common';
import { BookService } from './book.service';
import { Auth } from 'src/common/auth.decorator';
import {
  BookResponse,
  CreateBookRequest,
  UpdateBookRequest,
} from 'src/model/book.model';
import { WebResponse } from 'src/model/web.model';
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
  async getAll(@Auth() user: User): Promise<WebResponse<BookResponse[]>> {
    const result = await this.bookService.getAll(user);
    return {
      data: result,
    };
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
