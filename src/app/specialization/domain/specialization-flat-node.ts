import { Specialization } from './specialization';

export class SpecializationFlatNode {
  constructor(
    public specialization: Specialization,
    public level = 1,
    public expandable = false,
    public isLoading = false
  ) {}
}
