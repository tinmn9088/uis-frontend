import { Category } from 'src/app/category/domain/category';

export interface DisciplineUpdateRequest {
  name: string;
  shortName: string;
  tags?: Category[];
}
