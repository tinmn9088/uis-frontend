import { Discipline } from './discipline';

export interface DisciplinePageableResponse {
  content: Discipline[];
  totalElements: number;
}
