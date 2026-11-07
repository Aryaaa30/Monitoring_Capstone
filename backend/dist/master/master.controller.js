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
exports.MasterController = void 0;
const common_1 = require("@nestjs/common");
const master_service_1 = require("./master.service");
const master_dto_1 = require("./master.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
let MasterController = class MasterController {
    constructor(masterService) {
        this.masterService = masterService;
    }
    // ---------------- MAHASISWA ----------------
    async getMahasiswa() {
        return this.masterService.getMahasiswa();
    }
    async createMahasiswa(dto, req) {
        return this.masterService.createMahasiswa(dto, req.user.id_pengguna);
    }
    async updateMahasiswa(id, dto, req) {
        return this.masterService.updateMahasiswa(parseInt(id, 10), dto, req.user.id_pengguna);
    }
    // ---------------- KELOMPOK ----------------
    async getKelompok() {
        return this.masterService.getKelompok();
    }
    async createKelompok(dto, req) {
        return this.masterService.createKelompok(dto, req.user.id_pengguna);
    }
    // ---------------- DOSEN ----------------
    async getDosen() {
        return this.masterService.getDosen();
    }
    async createDosen(dto, req) {
        return this.masterService.createDosen(dto, req.user.id_pengguna);
    }
    // ---------------- KARTU RFID ----------------
    async getKartu() {
        return this.masterService.getKartu();
    }
    async registerKartu(dto, req) {
        return this.masterService.registerKartu(dto, req.user.id_pengguna);
    }
    async gantiKartu(dto, req) {
        return this.masterService.gantiKartu(dto, req.user.id_pengguna);
    }
};
exports.MasterController = MasterController;
__decorate([
    (0, common_1.Get)('mahasiswa'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MasterController.prototype, "getMahasiswa", null);
__decorate([
    (0, roles_decorator_1.Roles)('admin'),
    (0, common_1.Post)('mahasiswa'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [master_dto_1.CreateMahasiswaDto, Object]),
    __metadata("design:returntype", Promise)
], MasterController.prototype, "createMahasiswa", null);
__decorate([
    (0, roles_decorator_1.Roles)('admin'),
    (0, common_1.Put)('mahasiswa/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, master_dto_1.UpdateMahasiswaDto, Object]),
    __metadata("design:returntype", Promise)
], MasterController.prototype, "updateMahasiswa", null);
__decorate([
    (0, common_1.Get)('kelompok'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MasterController.prototype, "getKelompok", null);
__decorate([
    (0, roles_decorator_1.Roles)('admin'),
    (0, common_1.Post)('kelompok'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [master_dto_1.CreateKelompokDto, Object]),
    __metadata("design:returntype", Promise)
], MasterController.prototype, "createKelompok", null);
__decorate([
    (0, common_1.Get)('dosen'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MasterController.prototype, "getDosen", null);
__decorate([
    (0, roles_decorator_1.Roles)('admin'),
    (0, common_1.Post)('dosen'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [master_dto_1.CreateDosenDto, Object]),
    __metadata("design:returntype", Promise)
], MasterController.prototype, "createDosen", null);
__decorate([
    (0, common_1.Get)('kartu'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MasterController.prototype, "getKartu", null);
__decorate([
    (0, roles_decorator_1.Roles)('admin'),
    (0, common_1.Post)('kartu/register'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [master_dto_1.RegisterKartuDto, Object]),
    __metadata("design:returntype", Promise)
], MasterController.prototype, "registerKartu", null);
__decorate([
    (0, roles_decorator_1.Roles)('admin'),
    (0, common_1.Post)('kartu/ganti'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [master_dto_1.GantiKartuDto, Object]),
    __metadata("design:returntype", Promise)
], MasterController.prototype, "gantiKartu", null);
exports.MasterController = MasterController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('api/master'),
    __metadata("design:paramtypes", [master_service_1.MasterService])
], MasterController);
//# sourceMappingURL=master.controller.js.map