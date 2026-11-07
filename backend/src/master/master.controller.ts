import { Controller, Get, Post, Put, Body, Param, UseGuards, Request } from '@nestjs/common';
import { MasterService } from './master.service';
import {
  CreateMahasiswaDto,
  UpdateMahasiswaDto,
  CreateKelompokDto,
  CreateDosenDto,
  RegisterKartuDto,
  GantiKartuDto,
} from './master.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/master')
export class MasterController {
  constructor(private readonly masterService: MasterService) {}

  // ---------------- MAHASISWA ----------------
  @Get('mahasiswa')
  async getMahasiswa() {
    return this.masterService.getMahasiswa();
  }

  @Roles('admin')
  @Post('mahasiswa')
  async createMahasiswa(@Body() dto: CreateMahasiswaDto, @Request() req: any) {
    return this.masterService.createMahasiswa(dto, req.user.id_pengguna);
  }

  @Roles('admin')
  @Put('mahasiswa/:id')
  async updateMahasiswa(@Param('id') id: string, @Body() dto: UpdateMahasiswaDto, @Request() req: any) {
    return this.masterService.updateMahasiswa(parseInt(id, 10), dto, req.user.id_pengguna);
  }

  // ---------------- KELOMPOK ----------------
  @Get('kelompok')
  async getKelompok() {
    return this.masterService.getKelompok();
  }

  @Roles('admin')
  @Post('kelompok')
  async createKelompok(@Body() dto: CreateKelompokDto, @Request() req: any) {
    return this.masterService.createKelompok(dto, req.user.id_pengguna);
  }

  // ---------------- DOSEN ----------------
  @Get('dosen')
  async getDosen() {
    return this.masterService.getDosen();
  }

  @Roles('admin')
  @Post('dosen')
  async createDosen(@Body() dto: CreateDosenDto, @Request() req: any) {
    return this.masterService.createDosen(dto, req.user.id_pengguna);
  }

  // ---------------- KARTU RFID ----------------
  @Get('kartu')
  async getKartu() {
    return this.masterService.getKartu();
  }

  @Roles('admin')
  @Post('kartu/register')
  async registerKartu(@Body() dto: RegisterKartuDto, @Request() req: any) {
    return this.masterService.registerKartu(dto, req.user.id_pengguna);
  }

  @Roles('admin')
  @Post('kartu/ganti')
  async gantiKartu(@Body() dto: GantiKartuDto, @Request() req: any) {
    return this.masterService.gantiKartu(dto, req.user.id_pengguna);
  }
}

