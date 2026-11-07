import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { PresensiModule } from './presensi/presensi.module';
import { RekapModule } from './rekap/rekap.module';
import { MasterModule } from './master/master.module';

/**
 * Modul Utama (Root Module): Mengintegrasikan seluruh modul sistem monitoring capstone UMY.
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    AuthModule,
    PresensiModule,
    RekapModule,
    MasterModule,
  ],
})
export class AppModule {}

