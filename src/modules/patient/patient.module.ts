import { Module } from '@nestjs/common';
import { PatientController } from './patient.controller';
import { PatientService } from './patient.service';
import { MulterModule } from '@nestjs/platform-express';
import { ExcelParserService } from './service/excel-parser.service';
import { PatientRepositoryModule } from '@domain/patient/patient-repository.module';

@Module({
    imports: [PatientRepositoryModule, MulterModule.register()],
    controllers: [PatientController],
    providers: [PatientService, ExcelParserService],
    exports: [PatientService],
})
export class PatientModule {}
