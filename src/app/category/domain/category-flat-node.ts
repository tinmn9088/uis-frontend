import { Category } from './category';

export class CategoryFlatNode {
  constructor(
    public category: Category,
    public level = 1,
    public expandable = false,
    public isLoading = false
  ) {}
}
