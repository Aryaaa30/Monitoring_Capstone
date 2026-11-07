"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
/**
 * Fungsi: Titik masuk utama aplikasi backend NestJS untuk Sistem Monitoring Kehadiran Capstone.
 */
async function bootstrap() {
    const logger = new common_1.Logger('Bootstrap');
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    // Mengizinkan Cross-Origin Resource Sharing (CORS) agar Next.js dapat mengakses API
    app.enableCors({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
    });
    // Mengaktifkan validasi DTO otomatis pada setiap request
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: false,
    }));
    const port = process.env.PORT || 3001;
    await app.listen(port);
    logger.log(`Backend API Sistem Monitoring Capstone berjalan di port: http://localhost:${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map