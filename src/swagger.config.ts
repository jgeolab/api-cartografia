// src/swagger.config.ts
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import * as fs from 'fs';
import * as yaml from 'yaml';

export function setupSwagger(app: INestApplication) {
  if (process.env.NODE_ENV !== 'development') {
    console.log('🚫 Swagger deshabilitado en entorno de producción.');
    return;
  }

  const config = new DocumentBuilder()
    .setTitle('API Geoespaciales')
    .setDescription(
      'Conjunto de APIs con datos de cartografía, socioeconómicos, y más.',
    )
    .setVersion('1.0')
    // Asegúrate de que todas tus etiquetas estén aquí
    .addTag('Cartografía')
    .addTag('Indicadores Demográficos')
    .addTag('Comercio')
    .addTag('Vivienda')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Se ejecutará cada vez que se inicie el servidor en desarrollo.
  const yamlString = yaml.stringify(document);
  fs.writeFileSync('./contrato-api-carto.yaml', yamlString);
  console.log(
    '📄 Especificación OpenAPI (contrato-api-carto.yaml) generada/actualizada.',
  );

  // La configuración de la UI se mantiene igual.
  SwaggerModule.setup('api/documentation', app, document);
  console.log('📄 Swagger UI habilitada en /api/documentation');
}
