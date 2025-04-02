export interface ClientEntity {
  id: string;
  name: string;

  createdAt: Date;
  updatedAt: Date;
}

export interface NewClientEntity {
  id: string;
  name: string;
}
