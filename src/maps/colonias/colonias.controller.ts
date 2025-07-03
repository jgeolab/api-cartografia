import {
  Controller,
  Get,
  Query,
  Res,
  HttpStatus,
  Headers,
} from '@nestjs/common';
import { ColoniasService } from './colonias.service';
import { ColoniasKeysDto } from './dto/colonias-keys.dto';
import { ColoniaCoordenadasDto } from './dto/colonia-coordenadas.dto';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

@ApiTags('Catálogos Cartografía')
@Controller('colonias')
export class ColoniasController {
  constructor(private readonly coloniasService: ColoniasService) {}

  // El método getByIds seguiría una estructura similar...
  @Get('por-id')
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

      return res.status(HttpStatus.OK).json({
        status: 'success',
        folio: folio,
        timestamp: new Date().toISOString(),
        itemCount: colonias.length,
        data: colonias,
      });
    } catch (error) {
      // En un caso real, aquí podrías loggear el 'error'
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
  // Usamos el decorador @Res() para tener control total sobre la respuesta.
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

      // Construimos el objeto de respuesta exitosa
      return res.status(HttpStatus.OK).json({
        status: 'success',
        folio: folio,
        timestamp: new Date().toISOString(),
        itemCount: colonias.length,
        data: colonias,
      });
    } catch (error) {
      // En un caso real, aquí podrías loggear el 'error'
      // Construimos el objeto de respuesta de error
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
