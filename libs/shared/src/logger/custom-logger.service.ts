import { Injectable, ConsoleLogger } from '@nestjs/common';

/**
 * Logger personalizado
 * Formato estructurado JSON para producción
 */
@Injectable()
export class CustomLogger extends ConsoleLogger {
  error(message: string, trace: string, context?: string) {
    if (process.env.NODE_ENV === 'production') {
      console.log(JSON.stringify({
        level: 'error',
        message,
        trace,
        context,
        timestamp: new Date().toISOString()
      }));
    } else {
      super.error(message, trace, context);
    }
  }

  log(message: string, context?: string) {
    if (process.env.NODE_ENV === 'production') {
      console.log(JSON.stringify({
        level: 'info',
        message,
        context,
        timestamp: new Date().toISOString()
      }));
    } else {
      super.log(message, context);
    }
  }
}
