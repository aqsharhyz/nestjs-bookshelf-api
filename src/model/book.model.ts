export class BookResponse {
  id: number;
  title: string;
  year: number;
  author: string;
  publisher: string;
  isFinished: boolean;
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

// export class SearchBookRequest {}
