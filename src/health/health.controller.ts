// src/health/health.controller.ts
import { Controller, Get, Res } from '@nestjs/common';
import { CloudsqlService } from '../cloudsql/cloudsql.service';
import { Response } from 'express';
import { ApiTags, ApiExcludeController } from '@nestjs/swagger';

type HealthCheckResult = {
  now: Date;
};

@ApiExcludeController()
@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly cloudsqlService: CloudsqlService) {}

  @Get()
  async check(@Res() res: Response) {
    try {
      // Le aseguramos a TypeScript que el resultado será un array de nuestro tipo definido.
      const result = await this.cloudsqlService.getClient()<
        HealthCheckResult[]
      >`SELECT NOW()`;

      res.setHeader('x-health', 'ok');
      return res.status(200).json({
        status: 'Estoy funcionando, y conectado a la DB',
        dbTime: result[0].now,
        timestamp: new Date().toISOString(),
      });
    } catch (_error) {
      // para indicar a ESLint que es intencional no usarla en este bloque.
      res.setHeader('x-health', 'fail');
      return res.status(500).json({
        status: 'Error de conexión a la base de datos',
        timestamp: new Date().toISOString(),
      });
    }
  }
}
