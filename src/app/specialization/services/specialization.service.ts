import { Injectable } from '@angular/core';
import { Specialization } from '../models/specialization.model';

export class SpecializationFlatNode {
  constructor(
    public specialization: Specialization,
    public level = 1,
    public expandable = false,
    public isLoading = false
  ) {}
}

export const getLevel = (node: SpecializationFlatNode) => node.level;

export const isExpandable = (node: SpecializationFlatNode) => node.expandable;

@Injectable({
  providedIn: 'root',
})
export class SpecializationService {
  private readonly TREE_DATA: Specialization[] = [
    {
      id: 1,
      name: 'Специальность А',
      shortName: 'СА',
      cipher: '001',
      children: [
        {
          id: 4,
          name: 'Специальность А1',
          shortName: 'СА1',
          cipher: '0011',
          children: [
            {
              id: 7,
              name: 'Специальность А1 (**) AAAAAAAAAAAAAAAAAAAAAAA<<<<<<<<<',
              shortName: 'СА1(**)',
              cipher: '00111',
              children: [],
            },
          ],
        },
        {
          id: 5,
          name: 'Специальность А2',
          shortName: 'СА2',
          cipher: '0012',
          children: [],
        },
      ],
    },
    {
      id: 2,
      name: 'Специальность Б',
      shortName: 'СБ',
      cipher: '002',
      children: [
        {
          id: 6,
          name: 'Специальность Б1',
          shortName: 'СБ1',
          cipher: '0021',
        },
      ],
    },
    {
      id: 3,
      name: 'Специальность В',
      shortName: 'СВ',
      cipher: '003',
    },
  ];

  initialData(): SpecializationFlatNode[] {
    return this.TREE_DATA.map(
      s => new SpecializationFlatNode(s, 0, this.isExpandable(s.id))
    );
  }

  getChildren(
    parentId: number,
    parents: Specialization[] = this.TREE_DATA
  ): Specialization[] | undefined {
    for (const parent of parents) {
      const found = this.findSpecialization(parentId, parent);
      if (found?.children?.length) return found.children;
    }
    return;
  }

  private findSpecialization(
    id: number,
    root: Specialization
  ): Specialization | undefined {
    if (root.id === id) return root;
    if (!root.children?.length) return;
    for (const child of root.children) {
      if (child.id === id) return child;
      const found = this.findSpecialization(id, child);
      if (found) return found;
    }
    return;
  }

  isExpandable(id: number): boolean {
    const children = this.getChildren(id);
    return !!children?.length;
  }
}
