import { Injectable } from '@nestjs/common';
import { CloudsqlService } from '../../cloudsql/cloudsql.service';
import { ColoniaCoordenadasDto } from './dto/colonia-coordenadas.dto';
import { ColoniasKeysDto } from './dto/colonias-keys.dto';

@Injectable()
export class ColoniasService {
  constructor(private cloudsql: CloudsqlService) {}

  async getByKeys(
    coledo: number,
    colcp: number,
    colficonsec: number,
  ): Promise<ColoniasKeysDto[]> {
    const sql = this.cloudsql.getClient();
    const result = await sql<ColoniasKeysDto[]>`
        SELECT cvegeo, cve_ent, cve_mun, cve_ageb
        FROM public.ags_a_4326
        WHERE cve_ent = ${coledo}
          AND cve_mun = ${colcp}
          AND cve_loc = ${colficonsec};
    `;
    return result;
  }

  async getByLocation(
    lat: number,
    lng: number,
    radio: number,
  ): Promise<ColoniaCoordenadasDto[]> {
    const sql = this.cloudsql.getClient();
    const result = await sql<ColoniaCoordenadasDto[]>`
        SELECT cvegeo, cve_ent, cve_mun, cve_ageb, ST_AsGeoJSON(geometry) as geometry
        FROM public.ags_a_4326
        WHERE ST_DWithin(
                      geometry::geography,
                      ST_SetSRID(ST_MakePoint(${lng}::float8, ${lat}::float8), 4326)::geography,
                      ${radio}::float8
              );
    `;
    return result;
  }
}
