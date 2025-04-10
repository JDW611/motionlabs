import { Inject, Injectable } from '@nestjs/common';
import { ExcelParserService } from './service/excel-parser.service';
import {
    IPatientRepository,
    PatientRepositoryKey,
} from '@domain/patient/patient-repository.interface';

@Injectable()
export class PatientService {
    constructor(
        private readonly excelParserService: ExcelParserService,
        @Inject(PatientRepositoryKey) private readonly repository: IPatientRepository,
    ) {}

    async createPatients(file: Express.Multer.File) {
        const result = this.excelParserService.parseAndValidate(file);

        const mergedPatients = this.excelParserService.mergeRows(result.validRows);

        const processedRows = await this.repository.upsert(mergedPatients);

        return {
            totalRows: result.totalRows,
            processedRows: processedRows,
            skippedRows: result.skippedRows,
        };
    }
}
