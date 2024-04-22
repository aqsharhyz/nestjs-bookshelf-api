import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma.service';
import { ValidationService } from 'src/common/validation.service';
import {
  CategoryResponse,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from 'src/model/category.model';
import { Logger } from 'winston';
import { Category } from '@prisma/client';
import { CategoryValidation } from './category.validation';

@Injectable()
export class CategoryService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
    private validationService: ValidationService,
  ) {}

  async createCategory(
    request: CreateCategoryRequest,
  ): Promise<CategoryResponse> {
    this.logger.info(`createCategory: ${JSON.stringify(request)}`);

    const createRequest: CreateCategoryRequest =
      this.validationService.validate(CategoryValidation.CREATE, request);

    if (this.checkIfCategoryExist(createRequest.name)) {
      throw new HttpException('Category already exist', HttpStatus.CONFLICT);
    }

    const category = await this.prismaService.category.create({
      data: {
        ...createRequest,
      },
    });
    return await this.toCategoryResponse(category);
  }

  async getCategory(categoryId: number): Promise<CategoryResponse> {
    this.logger.info(`getCategory: ${categoryId}`);
    const category = await this.prismaService.category.findUnique({
      where: {
        id: categoryId,
      },
    });
    return await this.toCategoryResponse(category);
  }

  async getBooksByCategory(categoryId: number): Promise<CategoryResponse> {
    this.logger.info(`getBooksByCategory: ${categoryId}`);
    const category = await this.prismaService.category.findUnique({
      where: {
        id: categoryId,
      },
    });
    return await this.toCategoryResponse(category, true);
  }

  async getAllCategories() {
    return await Promise.all(
      (await this.prismaService.category.findMany()).map((category) =>
        this.toCategoryResponse(category),
      ),
    );
  }

  async updateCategory(
    categoryId: number,
    request: UpdateCategoryRequest,
  ): Promise<CategoryResponse> {
    this.logger.info(`updateCategory: ${JSON.stringify(request)}`);
    const updateRequest: UpdateCategoryRequest =
      this.validationService.validate(CategoryValidation.UPDATE, request);

    if (this.checkIfCategoryExist(updateRequest.name)) {
      throw new HttpException('Category already exist', HttpStatus.CONFLICT);
    }

    const category = await this.prismaService.category.update({
      where: {
        id: categoryId,
      },
      data: {
        ...updateRequest,
      },
    });
    return await this.toCategoryResponse(category);
  }

  async checkIfCategoryExist(category_name: string): Promise<boolean> {
    return (
      (await this.prismaService.category.findFirst({
        where: {
          name: category_name,
        },
      })) !== null
    );
  }

  async getCategoryId(category_name: string): Promise<number> {
    const category = await this.prismaService.category.findFirst({
      where: {
        name: category_name,
      },
    });
    return category.id;
  }

  async toCategoryResponse(
    category: Category,
    withBook: boolean = false,
  ): Promise<CategoryResponse> {
    return {
      id: category.id,
      name: category.name,
      description: category.description,
      books: withBook
        ? await this.prismaService.book.findMany({
            where: {
              categoryId: category.id,
            },
          })
        : [],
    };
  }
}
