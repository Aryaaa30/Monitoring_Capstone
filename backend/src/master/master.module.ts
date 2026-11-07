import { Module } from '@nestjs/common';
import { MasterService } from './master.service';
import { MasterController } from './master.controller';

/**
 * Modul: Pengelolaan data master mahasiswa, kelompok capstone, dosen pembimbing, dan kartu RFID.
 */
@Module({
  providers: [MasterService],
  controllers: [MasterController],
  exports: [MasterService],
})
export class MasterModule {}

