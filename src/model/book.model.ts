import { CommentResponse } from './comment.model';

export class BookResponse {
  id: number;
  title: string;
  year: number;
  author: string;
  publisher: string;
  isFinished: boolean;
  comments?: CommentResponse[];
}

export class CreateBookRequest {
  title: string;
  year: number;
  author: string;
  publisher: string;
  isFinished: boolean;
}

export class UpdateBookRequest {
  id: number;
  title?: string;
  year?: number;
  author?: string;
  publisher?: string;
  isFinished?: boolean;
}

export class SearchBookRequest {
  title?: string;
  year?: number;
  author?: string;
  publisher?: string;
  isFinished?: boolean;
  page?: number;
  size?: number;
  sort?: string;
}

export class SimpleSearchBookRequest {
  search?: string;
  page?: number;
}
