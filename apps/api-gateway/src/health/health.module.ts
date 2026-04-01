import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { HealthController } from './health.controller';

// Módulo de Health checks con dependencias
@Module({
  imports: [HttpModule],
  controllers: [HealthController],
  providers: [],
  exports: [],
})
export class HealthModule {}
