// En swagger.config.ts
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export function setupSwagger(app: INestApplication) {
  // La lógica para deshabilitar en producción es correcta.
  if (process.env.NODE_ENV !== 'development') {
    console.log('🚫 Swagger deshabilitado en entorno de producción.');
    return;
  }

  const config = new DocumentBuilder()
    .setTitle('API Geoespaciales') // <--- Nuevo Título
    .setDescription(
      'Conjunto de APIs con datos de cartografía, socioeconómicos, y más.',
    )
    .setVersion('1.0')
    // Categorias del API
    .addTag('Catálogos Cartografía')
    .addTag('Indicadores Socioeconómicos')
    .addTag('Comercio')
    .addTag('Vivienda')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  console.log('📄 Swagger habilitado en /api');
}
