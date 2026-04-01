import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Interceptor de respuesta para formato estándar según prueba técnica
// Decidí agregar este interceptor después de notar inconsistencias en las respuestas
// de los microservicios. Esto estandariza el formato para el frontend.
@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        // Hmm, ya vi que algunas respuestas vienen con formato estándar
        // Verifico si ya tiene el formato para no duplicar
        if (data && typeof data === 'object' && 'success' in data) {
          return data;
        }

        // Formato estándar para todas las respuestas exitosas
        return {
          success: true,
          data: data,
          timestamp: new Date().toISOString(),
          path: context.switchToHttp().getRequest().url,
        };
      }),
    );
  }
}
