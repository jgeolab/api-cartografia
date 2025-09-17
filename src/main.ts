import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './swagger.config';
import { ValidationPipe, VersioningType } from '@nestjs/common'; // <-- Importar

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilita el prefijo "v" para las versiones de la API (ej: /v1, /v2)
  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'v',
  });
  // Habilita la validación automática para todos los DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  setupSwagger(app);
  await app.listen(3000);
  console.log(`🚀 Servidor corriendo en http://localhost:3000`);
  console.log(`📄 Documentación en http://localhost:3000/api/documentation`);
}

bootstrap();
