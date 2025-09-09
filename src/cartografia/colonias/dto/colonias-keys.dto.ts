import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString } from 'class-validator';

export class ColoniasKeysDto {
  @ApiProperty({ example: '01' })
  @IsNotEmpty()
  @IsNumberString()
  cve_ent!: number;

  @ApiProperty({ example: '002' })
  @IsNotEmpty()
  @IsNumberString()
  cve_mun!: number;

  @ApiProperty({ example: '0001' })
  @IsNotEmpty()
  @IsNumberString()
  cve_loc!: number;
}
