import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import {
  CategoryResponse,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from './category.model';
import { WebResponse } from '../common/web.model';
import { AdminGuard } from '../common/admin.guard';

@Controller('api/category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Post()
  @HttpCode(200)
  @UseGuards(AdminGuard)
  async createCategory(
    @Body() request: CreateCategoryRequest,
  ): Promise<WebResponse<CategoryResponse>> {
    const result = await this.categoryService.createCategory(request);
    return {
      data: result,
    };
  }

  @Get('/:categoryId')
  @HttpCode(200)
  async getCategory(
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ): Promise<WebResponse<CategoryResponse>> {
    const result = await this.categoryService.getCategory(categoryId);
    return {
      data: result,
    };
  }

  @Get('/:categoryId/books')
  @HttpCode(200)
  async getBooksByCategory(
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ): Promise<WebResponse<CategoryResponse>> {
    const result = await this.categoryService.getBooksByCategory(categoryId);
    return {
      data: result,
    };
  }

  @Get()
  @HttpCode(200)
  async getAllCategories(): Promise<WebResponse<CategoryResponse[]>> {
    const result = await this.categoryService.getAllCategories();
    return {
      data: result,
    };
  }

  @Patch('/:categoryId')
  @HttpCode(200)
  @UseGuards(AdminGuard)
  async updateCategory(
    @Param('categoryId', ParseIntPipe) categoryId: number,
    request: UpdateCategoryRequest,
  ): Promise<WebResponse<CategoryResponse>> {
    const result = await this.categoryService.updateCategory(
      categoryId,
      request,
    );
    return {
      data: result,
    };
  }
}
