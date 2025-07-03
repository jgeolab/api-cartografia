import { Module } from '@nestjs/common';
import { ColoniasService } from './colonias.service';
import { ColoniasController } from './colonias.controller';
import { CloudsqlModule } from '../../cloudsql/cloudsql.module';

@Module({
  imports: [CloudsqlModule],
  controllers: [ColoniasController],
  providers: [ColoniasService],
})
export class ColoniasModule {}
