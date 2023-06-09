import { CurriculumSearchFilter } from './curriculum-search-filter';

export interface CurriculumSearchRequest {
  searchDto: CurriculumSearchFilter;
  pageable?: {
    page?: number;
    size?: number;
    sort?: string;
  };
}
