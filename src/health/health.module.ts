import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { CloudsqlModule } from '../cloudsql/cloudsql.module';

@Module({
  imports: [CloudsqlModule],
  controllers: [HealthController],
})
export class HealthModule {}
