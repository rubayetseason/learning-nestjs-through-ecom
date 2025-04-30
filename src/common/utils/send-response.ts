import { Response } from 'express';
import { IGenericResponse } from '../types/generic-response';

export const sendResponse = <T>(res: Response, data: IGenericResponse<T>): void => {
  const responseData: IGenericResponse<T> = {
    statusCode: data.statusCode,
    message: data.message,
    ...(data.meta && { meta: data.meta }),
    data: data.data,
  };

  res.status(data.statusCode).json(responseData);
};
