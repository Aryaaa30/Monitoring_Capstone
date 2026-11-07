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
exports.RekapController = void 0;
const common_1 = require("@nestjs/common");
const rekap_service_1 = require("./rekap.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let RekapController = class RekapController {
    constructor(rekapService) {
        this.rekapService = rekapService;
    }
    /**
     * Fungsi: Mengambil data statistik kartu dashboard ringkasan untuk monitoring lab.
     */
    async getDashboardStats() {
        return this.rekapService.getDashboardStats();
    }
    /**
     * Fungsi: Mengambil laporan rekap per kelompok, anggota, akumulasi jam, dan status capaian (ekspor PDF & tabel).
     */
    async getRekapKelompok(id_kelompok, id_dosen, status) {
        return this.rekapService.getRekapKelompok({
            id_kelompok: id_kelompok ? parseInt(id_kelompok, 10) : undefined,
            id_dosen: id_dosen ? parseInt(id_dosen, 10) : undefined,
            status,
        });
    }
};
exports.RekapController = RekapController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('dashboard'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RekapController.prototype, "getDashboardStats", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('kelompok'),
    __param(0, (0, common_1.Query)('id_kelompok')),
    __param(1, (0, common_1.Query)('id_dosen')),
    __param(2, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], RekapController.prototype, "getRekapKelompok", null);
exports.RekapController = RekapController = __decorate([
    (0, common_1.Controller)('api/rekap'),
    __metadata("design:paramtypes", [rekap_service_1.RekapService])
], RekapController);
//# sourceMappingURL=rekap.controller.js.map