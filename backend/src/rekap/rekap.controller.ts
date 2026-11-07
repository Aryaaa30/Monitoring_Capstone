import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { RekapService } from './rekap.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/rekap')
export class RekapController {
  constructor(private readonly rekapService: RekapService) {}

  /**
   * Fungsi: Mengambil data statistik kartu dashboard ringkasan untuk monitoring lab.
   */
  @UseGuards(JwtAuthGuard)
  @Get('dashboard')
  async getDashboardStats() {
    return this.rekapService.getDashboardStats();
  }

  /**
   * Fungsi: Mengambil laporan rekap per kelompok, anggota, akumulasi jam, dan status capaian (ekspor PDF & tabel).
   */
  @UseGuards(JwtAuthGuard)
  @Get('kelompok')
  async getRekapKelompok(
    @Query('id_kelompok') id_kelompok?: string,
    @Query('id_dosen') id_dosen?: string,
    @Query('status') status?: string,
  ) {
    return this.rekapService.getRekapKelompok({
      id_kelompok: id_kelompok ? parseInt(id_kelompok, 10) : undefined,
      id_dosen: id_dosen ? parseInt(id_dosen, 10) : undefined,
      status,
    });
  }
}

