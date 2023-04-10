export interface CategoryAddRequest {
  name: string;
  parent?: { id: number };
}
