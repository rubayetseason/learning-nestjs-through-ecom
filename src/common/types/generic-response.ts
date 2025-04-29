export type IGenericResponse<T> = {
  statusCode: number;
  message: string;
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
  data: T;
};
