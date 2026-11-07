import { Module } from '@nestjs/common';
import { RekapService } from './rekap.service';
import { RekapController } from './rekap.controller';

/**
 * Modul: Rekapitulasi presensi, perhitungan status otomatis, dan dashboard analitik.
 */
@Module({
  providers: [RekapService],
  controllers: [RekapController],
  exports: [RekapService],
})
export class RekapModule {}

