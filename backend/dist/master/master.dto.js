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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GantiKartuDto = exports.RegisterKartuDto = exports.CreateDosenDto = exports.CreateKelompokDto = exports.UpdateMahasiswaDto = exports.CreateMahasiswaDto = void 0;
const class_validator_1 = require("class-validator");
/**
 * Data Transfer Object untuk menambah data mahasiswa baru.
 */
class CreateMahasiswaDto {
}
exports.CreateMahasiswaDto = CreateMahasiswaDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'NIM tidak boleh kosong' }),
    (0, class_validator_1.IsString)({ message: 'NIM harus berupa teks' }),
    __metadata("design:type", String)
], CreateMahasiswaDto.prototype, "nim", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Nama mahasiswa tidak boleh kosong' }),
    (0, class_validator_1.IsString)({ message: 'Nama harus berupa teks' }),
    __metadata("design:type", String)
], CreateMahasiswaDto.prototype, "nama", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'ID Kelompok tidak boleh kosong' }),
    (0, class_validator_1.IsNumber)({}, { message: 'ID Kelompok harus berupa angka' }),
    __metadata("design:type", Number)
], CreateMahasiswaDto.prototype, "id_kelompok", void 0);
/**
 * Data Transfer Object untuk memperbarui data mahasiswa.
 */
class UpdateMahasiswaDto {
}
exports.UpdateMahasiswaDto = UpdateMahasiswaDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Nama harus berupa teks' }),
    __metadata("design:type", String)
], UpdateMahasiswaDto.prototype, "nama", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'ID Kelompok harus berupa angka' }),
    __metadata("design:type", Number)
], UpdateMahasiswaDto.prototype, "id_kelompok", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)({ message: 'Status aktif harus berupa boolean' }),
    __metadata("design:type", Boolean)
], UpdateMahasiswaDto.prototype, "status_aktif", void 0);
/**
 * Data Transfer Object untuk membuat kelompok capstone baru.
 */
class CreateKelompokDto {
}
exports.CreateKelompokDto = CreateKelompokDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Nama kelompok tidak boleh kosong' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateKelompokDto.prototype, "nama_kelompok", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateKelompokDto.prototype, "judul_proyek", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'ID Dosen pembimbing wajib dipilih' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateKelompokDto.prototype, "id_dosen", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateKelompokDto.prototype, "target_jam", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Tanggal mulai periode wajib diisi' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateKelompokDto.prototype, "periode_mulai", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Tanggal selesai periode wajib diisi' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateKelompokDto.prototype, "periode_selesai", void 0);
/**
 * Data Transfer Object untuk menambah data dosen pembimbing capstone.
 */
class CreateDosenDto {
}
exports.CreateDosenDto = CreateDosenDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'NIDN tidak boleh kosong' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDosenDto.prototype, "nidn", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Nama dosen tidak boleh kosong' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDosenDto.prototype, "nama", void 0);
/**
 * Data Transfer Object untuk registrasi awal kartu RFID ke mahasiswa.
 */
class RegisterKartuDto {
}
exports.RegisterKartuDto = RegisterKartuDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'ID Mahasiswa wajib diisi' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], RegisterKartuDto.prototype, "id_mahasiswa", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Nomor UID kartu wajib diisi' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterKartuDto.prototype, "uid_kartu", void 0);
/**
 * Data Transfer Object untuk penggantian kartu RFID yang hilang / rusak.
 */
class GantiKartuDto {
}
exports.GantiKartuDto = GantiKartuDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'ID Mahasiswa wajib diisi' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], GantiKartuDto.prototype, "id_mahasiswa", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'UID kartu baru wajib diisi' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GantiKartuDto.prototype, "uid_kartu_baru", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GantiKartuDto.prototype, "alasan", void 0);
//# sourceMappingURL=master.dto.js.map