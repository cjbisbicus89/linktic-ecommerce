import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Excepción de negocio personalizada
 * Permite lanzar errores de dominio específicos
 */
export class BusinessException extends HttpException {
  constructor(
    message: string,
    code: string,
    status: HttpStatus = HttpStatus.BAD_REQUEST
  ) {
    super({
      message,
      code,
      statusCode: status,
      timestamp: new Date().toISOString()
    }, status);
  }
}
