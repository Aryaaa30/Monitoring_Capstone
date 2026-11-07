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
exports.KoreksiPresensiDto = exports.TapCardDto = void 0;
const class_validator_1 = require("class-validator");
/**
 * Data Transfer Object untuk permintaan tap kartu RFID dari terminal presensi.
 */
class TapCardDto {
}
exports.TapCardDto = TapCardDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'UID kartu tidak boleh kosong' }),
    (0, class_validator_1.IsString)({ message: 'UID kartu harus berupa string' }),
    __metadata("design:type", String)
], TapCardDto.prototype, "uid", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'Jeda detik harus berupa angka' }),
    (0, class_validator_1.Min)(0, { message: 'Jeda detik minimal 0' }),
    __metadata("design:type", Number)
], TapCardDto.prototype, "jeda_detik", void 0);
/**
 * Data Transfer Object untuk formulir koreksi presensi (sesi yang lupa tap keluar).
 */
class KoreksiPresensiDto {
}
exports.KoreksiPresensiDto = KoreksiPresensiDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Waktu keluar harus diisi' }),
    (0, class_validator_1.IsString)({ message: 'Format waktu keluar harus berupa string tanggal/waktu ISO valid' }),
    __metadata("design:type", String)
], KoreksiPresensiDto.prototype, "waktu_keluar", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Alasan koreksi harus diisi' }),
    (0, class_validator_1.IsString)({ message: 'Alasan koreksi harus berupa teks' }),
    __metadata("design:type", String)
], KoreksiPresensiDto.prototype, "catatan_koreksi", void 0);
//# sourceMappingURL=presensi.dto.js.map