// src/maps/colonias/colonias.controller.ts
import {
  Controller,
  Get,
  Query,
  Res,
  HttpStatus,
  Headers,
  Logger,
} from '@nestjs/common';
import { ColoniasService } from './colonias.service';
import { ColoniasKeysDto } from './dto/colonias-keys.dto';
import { ColoniaCoordenadasDto } from './dto/colonia-coordenadas.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

@ApiTags('Cartografía') // Etiqueta actualizada
@Controller({ path: 'colonias', version: '1' }) // Versionado y ruta base
export class ColoniasController {
  private readonly logger = new Logger(ColoniasController.name);
  constructor(private readonly coloniasService: ColoniasService) {}

  @Get('por-id')
  @ApiOperation({
    summary: 'Obtiene una o más colonias por sus claves geoestadísticas.',
  })
  @ApiResponse({
    status: 200,
    description: 'Búsqueda exitosa. Devuelve un arreglo de localidades.',
  })
  @ApiResponse({
    status: 204,
    description: 'Búsqueda exitosa pero sin resultados.',
  })
  @ApiResponse({
    status: 400,
    description: 'Parámetros de consulta inválidos.',
  })
  async getByIds(
    @Query() params: ColoniasKeysDto,
    @Res() res: Response,
    @Headers('x-cloud-trace-context') traceId: string,
  ) {
    const folio = traceId ? traceId.split('/')[0] : uuidv4();
    try {
      const colonias = await this.coloniasService.getByKeys(
        params.cve_ent,
        params.cve_mun,
        params.cve_loc,
      );
      // Si no hay resultados, devolvemos 204 No Content
      if (!colonias || colonias.length === 0) {
        return res.status(HttpStatus.NO_CONTENT).send();
      }

      // Si hay resultados, devolvemos 200 OK con el payload
      return res.status(HttpStatus.OK).json({
        status: 'success',
        folio: folio,
        timestamp: new Date().toISOString(),
        itemCount: colonias.length,
        data: colonias,
      });
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(
          `[Folio: ${folio}] Fallo en getByIds con params: ${JSON.stringify(params)}`,
          error.stack,
        );
      } else {
        this.logger.error(
          `[Folio: ${folio}] Fallo en getByIds con params: ${JSON.stringify(params)} - Se lanzó un error de tipo no estándar`,
          error,
        );
      }
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        folio: folio,
        timestamp: new Date().toISOString(),
        error: {
          code: 'DATABASE_ERROR',
          message: 'Ocurrió un error al consultar los datos.',
        },
      });
    }
  }

  @Get('por-coordenadas')
  @ApiOperation({
    summary: 'Busca colonias dentro de un radio a partir de coordenadas.',
  })
  @ApiResponse({
    status: 200,
    description: 'Búsqueda exitosa. Devuelve un arreglo de colonias.',
  })
  @ApiResponse({
    status: 204,
    description: 'Búsqueda exitosa pero sin resultados.',
  })
  @ApiResponse({
    status: 400,
    description:
      'Parámetros de consulta inválidos (ej. lat/lng fuera de rango).',
  })
  async getByCoords(
    @Query() params: ColoniaCoordenadasDto,
    @Res() res: Response,
    @Headers('x-cloud-trace-context') traceId: string,
  ) {
    const folio = traceId ? traceId.split('/')[0] : uuidv4();
    try {
      const colonias = await this.coloniasService.getByLocation(
        params.lat,
        params.lng,
        params.radio ?? 1000,
      );

      if (!colonias || colonias.length === 0) {
        return res.status(HttpStatus.NO_CONTENT).send();
      }

      return res.status(HttpStatus.OK).json({
        status: 'success',
        folio: folio,
        timestamp: new Date().toISOString(),
        itemCount: colonias.length,
        data: colonias,
      });
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(
          `[Folio: ${folio}] Fallo en getByIds con params: ${JSON.stringify(params)}`,
          error.stack,
        );
      } else {
        this.logger.error(
          `[Folio: ${folio}] Fallo en getByIds con params: ${JSON.stringify(params)} - Se lanzó un error de tipo no estándar`,
          error,
        );
      }
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        folio: folio,
        timestamp: new Date().toISOString(),
        error: {
          code: 'QUERY_ERROR',
          message: 'Ocurrió un error al procesar la búsqueda por coordenadas.',
        },
      });
    }
  }
}
