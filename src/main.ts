import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  setupSwagger(app);
  await app.listen(3000);
  console.log(`🚀 Servidor corriendo en http://localhost:3000`);
  console.log(`📄 Documentación en http://localhost:3000/api`);
}

bootstrap();
