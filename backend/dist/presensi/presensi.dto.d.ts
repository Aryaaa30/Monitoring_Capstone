/**
 * Data Transfer Object untuk permintaan tap kartu RFID dari terminal presensi.
 */
export declare class TapCardDto {
    uid: string;
    jeda_detik?: number;
}
/**
 * Data Transfer Object untuk formulir koreksi presensi (sesi yang lupa tap keluar).
 */
export declare class KoreksiPresensiDto {
    waktu_keluar: string;
    catatan_koreksi: string;
}
