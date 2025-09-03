import { ApiProperty } from '@nestjs/swagger';

export class ColoniaCoordenadasDto {
  @ApiProperty({ example: 21.880449 })
  lat!: number;

  @ApiProperty({ example: -102.296179 })
  lng!: number;

  @ApiProperty({
    example: 1000,
    description: 'Radio de búsqueda en metros',
    required: false,
  })
  radio?: number = 1000;
}
