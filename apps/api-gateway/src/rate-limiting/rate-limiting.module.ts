import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';

// Módulo de Rate Limiting según arquitectura
@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minuto
        limit: 100, // 100 requests por minuto
      },
    ]),
  ],
  exports: [ThrottlerModule],
})
export class RateLimitingModule {}
