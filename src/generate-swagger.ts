// src/generate-swagger.ts
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as fs from 'fs';
import * as yaml from 'yaml';

async function generateSwaggerSpec() {
  const app = await NestFactory.create(AppModule, { logger: false });

  // --- NUEVA CONFIGURACIÓN (idéntica a la de swagger.config.ts) ---
  const config = new DocumentBuilder()
    .setTitle('API Geoespaciales') // <--- Nuevo Título
    .setDescription(
      'Conjunto de APIs con datos de cartografía, socioeconómicos, y más.',
    )
    .setVersion('1.0')
    .addTag('Catálogos Cartografía')
    .addTag('Indicadores Socioeconómicos')
    .addTag('Comercio')
    .addTag('Vivienda')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  const yamlString = yaml.stringify(document);
  fs.writeFileSync('./contrato-api-carto.yaml', yamlString);
  console.log(
    '✅ Especificación OpenAPI generada exitosamente en openapi.yaml',
  );

  await app.close();
  process.exit(0);
}

generateSwaggerSpec();
