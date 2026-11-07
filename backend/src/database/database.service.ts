import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sql from 'mssql';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DatabaseService.name);
  private pool: sql.ConnectionPool;

  constructor(private readonly configService: ConfigService) {}

  /**
   * Fungsi: Menginisialisasi dan menghubungkan aplikasi ke SQL Server saat backend pertama kali dijalankan.
   */
  async onModuleInit() {
    await this.connectToDatabase();
  }

  /**
   * Fungsi: Memutus koneksi pool database secara aman saat aplikasi backend dimatikan.
   */
  async onModuleDestroy() {
    if (this.pool) {
      await this.pool.close();
      this.logger.log('Koneksi ke SQL Server berhasil ditutup.');
    }
  }

  /**
   * Fungsi: Membuat koneksi pool ke database SQL Server berdasarkan file konfigurasi .env.
   */
  private async connectToDatabase(): Promise<sql.ConnectionPool> {
    const server = this.configService.get<string>('DB_SERVER', 'localhost');
    const port = parseInt(this.configService.get<string>('DB_PORT', '1433'), 10);
    const database = this.configService.get<string>('DB_NAME', 'Monitoring_Capstone');
    const user = this.configService.get<string>('DB_USER', 'sa');
    const password = this.configService.get<string>('DB_PASSWORD', '');
    const trustServerCertificate = this.configService.get<string>('DB_TRUST_SERVER_CERTIFICATE', 'true') === 'true';

    const config: sql.config = {
      server,
      port,
      database,
      user,
      password,
      options: {
        encrypt: false,
        trustServerCertificate,
        enableArithAbort: true,
      },
      pool: {
        max: 15,
        min: 2,
        idleTimeoutMillis: 30000,
      },
    };

    try {
      this.logger.log(`Menghubungkan ke database SQL Server [${server}:${port}/${database}]...`);
      this.pool = await new sql.ConnectionPool(config).connect();
      this.logger.log('Koneksi ke database SQL Server Monitoring_Capstone BERHASIL!');
      return this.pool;
    } catch (error) {
      this.logger.error(`GAGAL terhubung ke database SQL Server: ${error.message}`);
      return null;
    }
  }

  /**
   * Fungsi: Mengambil instance pool koneksi aktif untuk query SQL Server.
   */
  getPool(): sql.ConnectionPool {
    return this.pool;
  }

  /**
   * Fungsi: Menjalankan query SQL mentah dengan parameter untuk mencegah SQL Injection.
   */
  async query<T = any>(queryText: string, params?: { [key: string]: any }): Promise<T[]> {
    if (!this.pool || !this.pool.connected) {
      await this.connectToDatabase();
    }
    const request = this.pool.request();
    if (params) {
      for (const key of Object.keys(params)) {
        request.input(key, params[key]);
      }
    }
    const result = await request.query(queryText);
    return result.recordset as T[];
  }

  /**
   * Fungsi: Menjalankan Stored Procedure di SQL Server (seperti dbo.sp_tap_kartu).
   */
  async executeProcedure<T = any>(procedureName: string, params?: { [key: string]: any }): Promise<T[]> {
    if (!this.pool || !this.pool.connected) {
      await this.connectToDatabase();
    }
    const request = this.pool.request();
    if (params) {
      for (const key of Object.keys(params)) {
        request.input(key, params[key]);
      }
    }
    const result = await request.execute(procedureName);
    return result.recordset as T[];
  }
}

