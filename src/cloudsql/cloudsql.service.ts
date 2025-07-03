// src/cloudsql/cloudsql.service.ts
import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// Usaremos <any> como el tipo genérico para máxima compatibilidad.
import postgres, { Sql, Options } from 'postgres';

@Injectable()
export class CloudsqlService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(CloudsqlService.name);
  // Se usa Sql<any> para evitar conflictos de tipos.
  private sql!: Sql<any>;

  constructor(private config: ConfigService) {}

  async onModuleInit(): Promise<void> {
    try {
      const isProduction = this.config.get<string>('NODE_ENV') === 'production';

      if (isProduction) {
        this.logger.log(
          '[PROD] Entorno de producción detectado. Usando objeto de configuración para Socket.',
        );

        const socketPath = `/cloudsql/${this.config.get<string>(
          'DB_INSTANCE_CONNECTION_NAME',
        )}`;

        // Se usa Options<any> para evitar conflictos de tipos.
        const prodOptions: Options<any> = {
          host: socketPath,
          user: this.config.get<string>('DB_USER'),
          password: this.config.get<string>('DB_PASS'),
          database: this.config.get<string>('DB_NAME'),
        };

        this.sql = postgres(prodOptions);
      } else {
        this.logger.log(
          '[DEV] Entorno de desarrollo detectado. Usando DATABASE_URL del .env',
        );
        const connectionString = this.config.get<string>('DATABASE_URL');

        if (!connectionString) {
          throw new Error(
            '¡Alerta! La variable DATABASE_URL no fue encontrada en el entorno.',
          );
        }

        this.sql = postgres(connectionString);
      }

      this.logger.log('Estableciendo conexión con la base de datos...');
      const result = await this.sql`SELECT NOW()`;
      this.logger.log(
        `✅ Conexión exitosa a la base de datos. Hora del servidor de BD: ${result[0].now}`,
      );
    } catch (error) {
      this.logger.error(
        '❌ Falla crítica al conectar con la base de datos. Error completo: ' +
          JSON.stringify(error, Object.getOwnPropertyNames(error)),
      );
      // Este comportamiento es correcto. Si la BD falla, la app debe detenerse.
      // Puedes ignorar la advertencia "'throw' of exception caught locally".
      throw error;
    }
  }

  getClient(): Sql<any> {
    return this.sql;
  }

  async onModuleDestroy() {
    if (this.sql) {
      await this.sql.end();
      this.logger.log(
        '🔌 Conexión a la base de datos cerrada de forma segura.',
      );
    }
  }
}
