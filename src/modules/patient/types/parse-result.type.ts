import { PatientVO } from '../vo/patient.vo';

export type UploadExcelResult = {
    totalRows: number;
    skippedRows: number;
    processedRows: number;
};

export type ParseResult = {
    validRows: PatientVO[];
    totalRows: number;
    skippedRows: number;
    processedRows: number;
};
