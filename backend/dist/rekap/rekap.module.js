"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RekapModule = void 0;
const common_1 = require("@nestjs/common");
const rekap_service_1 = require("./rekap.service");
const rekap_controller_1 = require("./rekap.controller");
/**
 * Modul: Rekapitulasi presensi, perhitungan status otomatis, dan dashboard analitik.
 */
let RekapModule = class RekapModule {
};
exports.RekapModule = RekapModule;
exports.RekapModule = RekapModule = __decorate([
    (0, common_1.Module)({
        providers: [rekap_service_1.RekapService],
        controllers: [rekap_controller_1.RekapController],
        exports: [rekap_service_1.RekapService],
    })
], RekapModule);
//# sourceMappingURL=rekap.module.js.map