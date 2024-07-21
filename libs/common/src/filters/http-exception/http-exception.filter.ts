import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const responseContent = exception.getResponse();
    const message =
      typeof responseContent === 'object' && 'message' in responseContent
        ? (responseContent as any).message
        : exception.message;

    response.status(status).json({
      statusCode: status,
      path: request.url,
      message: message,
    });
  }
}
