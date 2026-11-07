import { Module } from '@nestjs/common';
import { PresensiService } from './presensi.service';
import { PresensiController } from './presensi.controller';

/**
 * Modul: Manajemen transaksi tap presensi RFID, riwayat kehadiran, dan koreksi admin.
 */
@Module({
  providers: [PresensiService],
  controllers: [PresensiController],
  exports: [PresensiService],
})
export class PresensiModule {}

