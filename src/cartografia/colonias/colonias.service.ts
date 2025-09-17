import { Injectable } from '@nestjs/common';
import { CloudsqlService } from '../../cloudsql/cloudsql.service'; // Asegúrate de que la ruta sea correcta
import { ColoniaCoordenadasDto } from './dto/colonia-coordenadas.dto';
import { ColoniasKeysDto } from './dto/colonias-keys.dto';

// La interfaz reutilizable que ya creamos
export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}

@Injectable()
export class ColoniasService {
  constructor(private db: CloudsqlService) {}

  async getByKeys(
    params: ColoniasKeysDto, // Ahora recibe el DTO completo
  ): Promise<PaginatedResult<any>> {
    const { cve_ent, cve_mun, cve_loc, page = 1, limit = 10 } = params;
    const offset = (page - 1) * limit;
    const sql = this.db.getClient();

    const whereClause = sql`
      WHERE cve_ent = ${cve_ent}
        AND cve_mun = ${cve_mun}
        AND cve_loc = ${cve_loc}
    `;

    const [data, totalResult] = await Promise.all([
      sql`
        SELECT cvegeo, cve_ent, cve_mun, cve_ageb
        FROM public.ags_a_4326
        ${whereClause}
        ORDER BY cvegeo
        LIMIT ${limit} OFFSET ${offset}
      `,
      sql`
        SELECT COUNT(*) as total FROM public.ags_a_4326 ${whereClause}
      `,
    ]);

    const totalItems = Number(totalResult[0].total);
    const totalPages = Math.ceil(totalItems / limit);

    return {
      data,
      pagination: {
        totalItems,
        itemCount: data.length,
        itemsPerPage: limit,
        totalPages,
        currentPage: page,
      },
    };
  }

  // método par obtener resultados con geometrías
  async getByLocation(
    params: ColoniaCoordenadasDto,
  ): Promise<PaginatedResult<any>> {
    const { lat, lng, radio = 1000, page = 1, limit = 10 } = params;
    const offset = (page - 1) * limit;
    const sql = this.db.getClient();

    const whereClause = sql`
      WHERE ST_DWithin(
        geometry::geography,
        ST_SetSRID(ST_MakePoint(${lng}::float8, ${lat}::float8), 4326)::geography,
        ${radio}::float8
      )
    `;

    const [data, totalResult] = await Promise.all([
      sql`
        SELECT cvegeo, cve_ent, cve_mun, cve_ageb, ST_AsGeoJSON(geometry) as geometry
        FROM public.ags_a_4326
        ${whereClause}
        ORDER BY cvegeo
        LIMIT ${limit} OFFSET ${offset}
      `,
      sql`
        SELECT COUNT(*) as total FROM public.ags_a_4326 ${whereClause}
      `,
    ]);

    const totalItems = Number(totalResult[0].total);
    const totalPages = Math.ceil(totalItems / limit);

    return {
      data,
      pagination: {
        totalItems,
        itemCount: data.length,
        itemsPerPage: limit,
        totalPages,
        currentPage: page,
      },
    };
  }
}
