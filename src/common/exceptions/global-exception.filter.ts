import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { IGenericErrorMessage, IGenericErrorResponse } from '../types/generic-error-response';

interface ErrorResponseShape {
  message?: string;
  errorMessages?: IGenericErrorMessage[];
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal Server Error';
    let errorMessages: IGenericErrorMessage[] = [];

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const response = exception.getResponse();

      if (typeof response === 'string') {
        message = response;
      } else if (typeof response === 'object' && response !== null) {
        const resObj = response as ErrorResponseShape;
        message = resObj.message || message;
        errorMessages = resObj.message
          ? [{ path: req.path, message: resObj.message }]
          : resObj.errorMessages || [];
      }
    }

    const errorResponse: IGenericErrorResponse = {
      statusCode,
      message,
      errorMessages,
    };

    res.status(statusCode).json(errorResponse);
  }
}
