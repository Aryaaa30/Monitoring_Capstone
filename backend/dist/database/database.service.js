"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var DatabaseService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const sql = require("mssql");
let DatabaseService = DatabaseService_1 = class DatabaseService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(DatabaseService_1.name);
    }
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
    async connectToDatabase() {
        const server = this.configService.get('DB_SERVER', 'localhost');
        const port = parseInt(this.configService.get('DB_PORT', '1433'), 10);
        const database = this.configService.get('DB_NAME', 'Monitoring_Capstone');
        const user = this.configService.get('DB_USER', 'sa');
        const password = this.configService.get('DB_PASSWORD', '');
        const trustServerCertificate = this.configService.get('DB_TRUST_SERVER_CERTIFICATE', 'true') === 'true';
        const config = {
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
        }
        catch (error) {
            this.logger.error(`GAGAL terhubung ke database SQL Server: ${error.message}`);
            return null;
        }
    }
    /**
     * Fungsi: Mengambil instance pool koneksi aktif untuk query SQL Server.
     */
    getPool() {
        return this.pool;
    }
    /**
     * Fungsi: Menjalankan query SQL mentah dengan parameter untuk mencegah SQL Injection.
     */
    async query(queryText, params) {
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
        return result.recordset;
    }
    /**
     * Fungsi: Menjalankan Stored Procedure di SQL Server (seperti dbo.sp_tap_kartu).
     */
    async executeProcedure(procedureName, params) {
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
        return result.recordset;
    }
};
exports.DatabaseService = DatabaseService;
exports.DatabaseService = DatabaseService = DatabaseService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], DatabaseService);
//# sourceMappingURL=database.service.js.map