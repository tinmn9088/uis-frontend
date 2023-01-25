export interface Specialization {
  id: number;
  name: string;
  shortName: string;
  cipher: string;
  children?: Specialization[];
}
