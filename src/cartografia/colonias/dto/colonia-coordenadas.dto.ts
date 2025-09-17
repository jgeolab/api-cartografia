import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsLatitude, IsLongitude, IsNumber, IsOptional, Max, Min } from 'class-validator';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';

export class ColoniaCoordenadasDto extends PaginationQueryDto {
  @ApiProperty({ example: 21.880449 })
  @Type(() => Number)
  @IsLatitude()
  lat!: number;

  @ApiProperty({ example: -102.296179 })
  @Type(() => Number)
  @IsLongitude()
  lng!: number;

  @ApiProperty({
    example: 1000,
    description: 'Radio de búsqueda en metros',
    required: false,
    default: 1000,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100000)
  radio?: number = 1000;
}
