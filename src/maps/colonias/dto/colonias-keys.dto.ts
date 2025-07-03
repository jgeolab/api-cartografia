import { ApiProperty } from '@nestjs/swagger';

export class ColoniasKeysDto {
  @ApiProperty({ example: 108 })
  cve_ent!: number;

  @ApiProperty({ example: 13002 })
  cve_mun!: number;

  @ApiProperty({ example: 216 })
  cve_loc!: number;
}
