// src/maps/colonias/dto/colonias-keys.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length, IsNumberString } from 'class-validator';

export class ColoniasKeysDto {
  @ApiProperty({
    example: '01',
    description: 'Clave de la entidad federativa (2 dígitos)',
  })
  @IsNotEmpty()
  @IsNumberString()
  @Length(2, 2)
  cve_ent!: string;

  @ApiProperty({
    example: '002',
    description: 'Clave del municipio (3 dígitos)',
  })
  @IsNotEmpty()
  @IsNumberString()
  @Length(3, 3)
  cve_mun!: string;

  @ApiProperty({
    example: '0001',
    description: 'Clave de la localidad (4 dígitos)',
  })
  @IsNotEmpty()
  @IsNumberString()
  @Length(4, 4)
  cve_loc!: string;
}
