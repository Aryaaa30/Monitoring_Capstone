import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sql from 'mssql';
export declare class DatabaseService implements OnModuleInit, OnModuleDestroy {
    private readonly configService;
    private readonly logger;
    private pool;
    constructor(configService: ConfigService);
    /**
     * Fungsi: Menginisialisasi dan menghubungkan aplikasi ke SQL Server saat backend pertama kali dijalankan.
     */
    onModuleInit(): Promise<void>;
    /**
     * Fungsi: Memutus koneksi pool database secara aman saat aplikasi backend dimatikan.
     */
    onModuleDestroy(): Promise<void>;
    /**
     * Fungsi: Membuat koneksi pool ke database SQL Server berdasarkan file konfigurasi .env.
     */
    private connectToDatabase;
    /**
     * Fungsi: Mengambil instance pool koneksi aktif untuk query SQL Server.
     */
    getPool(): sql.ConnectionPool;
    /**
     * Fungsi: Menjalankan query SQL mentah dengan parameter untuk mencegah SQL Injection.
     */
    query<T = any>(queryText: string, params?: {
        [key: string]: any;
    }): Promise<T[]>;
    /**
     * Fungsi: Menjalankan Stored Procedure di SQL Server (seperti dbo.sp_tap_kartu).
     */
    executeProcedure<T = any>(procedureName: string, params?: {
        [key: string]: any;
    }): Promise<T[]>;
}
