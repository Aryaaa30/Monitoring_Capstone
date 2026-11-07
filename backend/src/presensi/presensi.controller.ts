import { Controller, Post, Get, Put, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { PresensiService } from './presensi.service';
import { TapCardDto, KoreksiPresensiDto } from './presensi.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('api/presensi')
export class PresensiController {
  constructor(private readonly presensiService: PresensiService) {}

  /**
   * Endpoint Publik: Menerima tap kartu RFID dari PC Terminal di pintu masuk laboratorium.
   * Catatan: Tidak memerlukan login/token karena diakses oleh mesin terminal dalam mode kios.
   */
  @Post('tap')
  async tapCard(@Body() tapCardDto: TapCardDto) {
    return this.presensiService.tapCard(tapCardDto);
  }

  /**
   * Endpoint Terproteksi: Mengambil daftar riwayat seluruh log presensi untuk admin dan dosen.
   */
  @UseGuards(JwtAuthGuard)
  @Get('logs')
  async getLogs(
    @Query('tanggal') tanggal?: string,
    @Query('id_kelompok') id_kelompok?: string,
    @Query('status_sesi') status_sesi?: string,
    @Query('search') search?: string,
  ) {
    return this.presensiService.getLogs({
      tanggal,
      id_kelompok: id_kelompok ? parseInt(id_kelompok, 10) : undefined,
      status_sesi,
      search,
    });
  }

  /**
   * Endpoint Terproteksi: Mengambil daftar mahasiswa yang saat ini sedang aktif di dalam lab.
   */
  @UseGuards(JwtAuthGuard)
  @Get('aktif')
  async getActiveSessions() {
    return this.presensiService.getActiveSessions();
  }

  /**
   * Endpoint Khusus Admin: Mengoreksi sesi presensi mahasiswa yang lupa tap saat pulang.
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Put('koreksi/:id')
  async koreksiPresensi(
    @Param('id') id: string,
    @Body() dto: KoreksiPresensiDto,
    @Request() req: any,
  ) {
    const idLog = parseInt(id, 10);
    return this.presensiService.koreksiPresensi(idLog, dto, req.user.id_pengguna);
  }
}

