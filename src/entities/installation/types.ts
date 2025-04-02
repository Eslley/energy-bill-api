export interface InstallationEntity {
  id: string;
  clientId: string;

  createdAt: Date;
  updatedAt: Date;
}

export interface NewInstallationEntity {
  id: string;
  clientId: string;
}
