import { Module, Global } from '@nestjs/common';
import { DatabaseService } from './database.service';

/**
 * Modul: Global Database Module agar DatabaseService dapat langsung dipakai di seluruh modul backend.
 */
@Global()
@Module({
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}

