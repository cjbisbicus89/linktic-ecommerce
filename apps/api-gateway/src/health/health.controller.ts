import { Controller, Get, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

// Health checks completos según arquitectura
@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly httpService: HttpService) {}

  @Get()
  @ApiOperation({ summary: 'Health check del API Gateway' })
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'api-gateway',
      version: '1.0.0',
    };
  }

  @Get('detailed')
  @ApiOperation({ summary: 'Health check detallado de todos los servicios' })
  async getDetailedHealth() {
    const services: any = {
      gateway: 'ok',
    };

    // Verificar servicios en paralelo con timeout robusto
    // Decidí usar Promise.allSettled en lugar de Promise.all para que
    // si un servicio falla, los demás sigan verificándose
    const healthChecks = [
      {
        name: 'products-service',
        url: 'http://localhost:4001/products',
      },
      {
        name: 'orders-service', 
        url: 'http://localhost:4002/orders',
      },
    ];

    // Ejecutar todas las verificaciones en paralelo
    // TODO: Implementar circuit breaker para no seguir intentando si un servicio cae
    await Promise.allSettled(
      healthChecks.map(async ({ name, url }) => {
        try {
          const response = await firstValueFrom(
            this.httpService.get(url, { 
              timeout: 2000, // 2 segundos es suficiente para health checks
              responseType: 'json'
            })
          );
          services[name] = 'ok';
        } catch {
          // No lanzo error, solo marco como error para que continúe la verificación
          services[name] = 'error';
        }
      })
    );

    const allServicesOk = Object.values(services).every(status => status === 'ok');

    return {
      status: allServicesOk ? 'ok' : 'partial',
      timestamp: new Date().toISOString(),
      services,
    };
  }
}
