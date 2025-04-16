import { PatientRecord } from '../../../domain/patient/patient-record';

export type UploadExcelResult = {
    totalRows: number;
    skippedRows: number;
    processedRows: number;
};

export type ParseResult = {
    validRows: PatientRecord[];
    totalRows: number;
    skippedRows: number;
    processedRows: number;
};
