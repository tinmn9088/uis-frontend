import { Category } from './category';

export interface CategoryPageableResponse {
  content: Category[];
  totalElements: number;
}
