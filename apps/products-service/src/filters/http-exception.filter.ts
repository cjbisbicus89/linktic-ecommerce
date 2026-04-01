import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

// Filtro de excepciones HTTP para Products Service
// Manejo específico para errores del microservicio de productos
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: HttpStatus;
    let message: string;
    let details: any;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else {
        message = (exceptionResponse as any).message || exception.message;
        details = (exceptionResponse as any).details || null;
      }
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Error interno del servicio de productos';
      details = null;
    }

    // Log específico del servicio
    this.logger.error(
      `[Products Service] ${request.method} ${request.url} - Status: ${status} - Message: ${message}`,
      exception instanceof Error ? exception.stack : exception,
    );

    // Respuesta de error estandarizada
    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      service: 'products-service',
      message,
      details,
      requestId: this.generateRequestId(),
    };

    response.status(status).json(errorResponse);
  }

  private generateRequestId(): string {
    return Math.random().toString(36).substring(2, 15);
  }
}
