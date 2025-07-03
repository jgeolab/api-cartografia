import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CloudsqlService } from './cloudsql.service';

@Module({
  imports: [ConfigModule],
  providers: [CloudsqlService],
  exports: [CloudsqlService],
})
export class CloudsqlModule {}
