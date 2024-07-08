

export interface IRole {
  id?: number;
  authority?: string;
}

export class Role implements IRole {
  authority?: string;
  constructor(public id?: number) {}
}
