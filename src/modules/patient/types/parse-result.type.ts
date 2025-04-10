import { PatientVO } from '../vo/patient.vo';

export type ParseResult = {
    validRows: PatientVO[];
    totalRows: number;
    skippedRows: number;
};
