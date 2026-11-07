import { MasterService } from './master.service';
import { CreateMahasiswaDto, UpdateMahasiswaDto, CreateKelompokDto, CreateDosenDto, RegisterKartuDto, GantiKartuDto } from './master.dto';
export declare class MasterController {
    private readonly masterService;
    constructor(masterService: MasterService);
    getMahasiswa(): Promise<any[]>;
    createMahasiswa(dto: CreateMahasiswaDto, req: any): Promise<{
        message: string;
    }>;
    updateMahasiswa(id: string, dto: UpdateMahasiswaDto, req: any): Promise<{
        message: string;
    }>;
    getKelompok(): Promise<any[]>;
    createKelompok(dto: CreateKelompokDto, req: any): Promise<{
        message: string;
    }>;
    getDosen(): Promise<any[]>;
    createDosen(dto: CreateDosenDto, req: any): Promise<{
        message: string;
    }>;
    getKartu(): Promise<any[]>;
    registerKartu(dto: RegisterKartuDto, req: any): Promise<{
        message: string;
    }>;
    gantiKartu(dto: GantiKartuDto, req: any): Promise<{
        message: string;
    }>;
}
