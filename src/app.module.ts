import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ColoniasModule } from './maps/colonias/colonias.module';
import { configValidationSchema } from './config/config.schema';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: configValidationSchema,
    }),
    ColoniasModule,
    HealthModule,
  ],
})
export class AppModule {}
