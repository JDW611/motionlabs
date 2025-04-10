import { Inject, Injectable } from '@nestjs/common';
import { ExcelParserService } from './service/excel-parser.service';
import {
    IPatientRepository,
    PatientRepositoryKey,
} from '@domain/patient/patient-repository.interface';
import { PatientEntity } from '@domain/patient/patient.entity';
import { PatientFilterDto } from './dto/request/patient-filter.dto';
import { PaginationDto } from './dto/request/pagination.dto';
import { PaginatedResponseDto } from './dto/response/paginated-response.dto';

@Injectable()
export class PatientService {
    constructor(
        private readonly excelParserService: ExcelParserService,
        @Inject(PatientRepositoryKey) private readonly repository: IPatientRepository,
    ) {}

    async createPatients(file: Express.Multer.File) {
        const result = this.excelParserService.parseAndValidate(file);

        const mergedPatients = this.excelParserService.mergeRows(result.validRows);

        await this.repository.upsert(mergedPatients);

        return {
            totalRows: result.totalRows,
            processedRows: result.processedRows,
            skippedRows: result.skippedRows,
        };
    }

    async findPatients(
        filter: PatientFilterDto,
        pagination: PaginationDto,
    ): Promise<PaginatedResponseDto<PatientEntity>> {
        return this.repository.findPatients(filter, pagination);
    }
}
