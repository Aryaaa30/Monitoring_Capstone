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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PresensiController = void 0;
const common_1 = require("@nestjs/common");
const presensi_service_1 = require("./presensi.service");
const presensi_dto_1 = require("./presensi.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
let PresensiController = class PresensiController {
    constructor(presensiService) {
        this.presensiService = presensiService;
    }
    /**
     * Endpoint Publik: Menerima tap kartu RFID dari PC Terminal di pintu masuk laboratorium.
     * Catatan: Tidak memerlukan login/token karena diakses oleh mesin terminal dalam mode kios.
     */
    async tapCard(tapCardDto) {
        return this.presensiService.tapCard(tapCardDto);
    }
    /**
     * Endpoint Terproteksi: Mengambil daftar riwayat seluruh log presensi untuk admin dan dosen.
     */
    async getLogs(tanggal, id_kelompok, status_sesi, search) {
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
    async getActiveSessions() {
        return this.presensiService.getActiveSessions();
    }
    /**
     * Endpoint Khusus Admin: Mengoreksi sesi presensi mahasiswa yang lupa tap saat pulang.
     */
    async koreksiPresensi(id, dto, req) {
        const idLog = parseInt(id, 10);
        return this.presensiService.koreksiPresensi(idLog, dto, req.user.id_pengguna);
    }
};
exports.PresensiController = PresensiController;
__decorate([
    (0, common_1.Post)('tap'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [presensi_dto_1.TapCardDto]),
    __metadata("design:returntype", Promise)
], PresensiController.prototype, "tapCard", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('logs'),
    __param(0, (0, common_1.Query)('tanggal')),
    __param(1, (0, common_1.Query)('id_kelompok')),
    __param(2, (0, common_1.Query)('status_sesi')),
    __param(3, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], PresensiController.prototype, "getLogs", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('aktif'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PresensiController.prototype, "getActiveSessions", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    (0, common_1.Put)('koreksi/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, presensi_dto_1.KoreksiPresensiDto, Object]),
    __metadata("design:returntype", Promise)
], PresensiController.prototype, "koreksiPresensi", null);
exports.PresensiController = PresensiController = __decorate([
    (0, common_1.Controller)('api/presensi'),
    __metadata("design:paramtypes", [presensi_service_1.PresensiService])
], PresensiController);
//# sourceMappingURL=presensi.controller.js.map