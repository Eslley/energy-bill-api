export interface DocumentEntity {
  id: string;
  fileName: string;
  mimeType: string;
  size: number;
  path: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface NewDocumentEntity {
  fileName: string;
  mimeType: string;
  size: number;
  path: string;
}
