import { CreatePostDto } from '../dto/create-post.dto';

export interface WebzResponse {
  totalResults: number;
  moreResultsAvailable: number;
  next: string;
  posts: CreatePostDto[];
  requestsLeft: number;
  warnings: string | null;
}
