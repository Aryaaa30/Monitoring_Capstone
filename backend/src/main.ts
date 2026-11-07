import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';

/**
 * Fungsi: Titik masuk utama aplikasi backend NestJS untuk Sistem Monitoring Kehadiran Capstone.
 */
async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Mengizinkan Cross-Origin Resource Sharing (CORS) agar Next.js dapat mengakses API
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Mengaktifkan validasi DTO otomatis pada setiap request
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  const port = process.env.PORT || 3001;
  await app.listen(port);
  logger.log(`Backend API Sistem Monitoring Capstone berjalan di port: http://localhost:${port}`);
}

bootstrap();

