// src/config.schema.ts

import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  // Variable para definir el entorno. Obligatoria.
  NODE_ENV: Joi.string()
    .valid('development', 'production')
    .default('development'),

  // --- REGLAS PARA DESARROLLO LOCAL ---
  // DATABASE_URL solo es obligatoria si estamos en 'development'.
  DATABASE_URL: Joi.string()
    .uri()
    .when('NODE_ENV', {
      is: 'development',
      then: Joi.required().messages({
        'any.required':
          'Para desarrollo, se requiere la variable DATABASE_URL en el .env',
      }),
      otherwise: Joi.optional(), // En producción, es opcional/no se usa.
    }),

  // --- REGLAS PARA PRODUCCIÓN EN CLOUD RUN ---
  // Las siguientes variables solo son obligatorias si estamos en 'production'.
  DB_USER: Joi.string().when('NODE_ENV', {
    is: 'production',
    then: Joi.required(),
  }),
  DB_PASS: Joi.string().when('NODE_ENV', {
    is: 'production',
    then: Joi.required(), // Viene de Secret Manager, pero debe existir.
  }),
  DB_NAME: Joi.string().when('NODE_ENV', {
    is: 'production',
    then: Joi.required(),
  }),
  DB_INSTANCE_CONNECTION_NAME: Joi.string().when('NODE_ENV', {
    is: 'production',
    then: Joi.required(),
  }),
});
