import { Injectable } from '@nestjs/common';
import { PatientVO } from '../vo/patient.vo';
import { ParseResult } from '../types/parse-result.type';
import * as XLSX from 'xlsx';

@Injectable()
export class ExcelParserService {
    parseAndValidate(file: Express.Multer.File): ParseResult {
        const workbook = XLSX.read(file.buffer, { type: 'buffer' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(worksheet);

        const patientVOs = rows.map(row => this.convertToPatientVO(row));

        const validRows: PatientVO[] = [];
        const invalidRows: PatientVO[] = [];

        for (const row of patientVOs) {
            if (this.isValid(row)) {
                const cleaned = this.clean(row);
                validRows.push(cleaned);
            } else {
                invalidRows.push(row);
            }
        }

        return { validRows, invalidRows };
    }

    private convertToPatientVO(row: any): PatientVO {
        return new PatientVO(
            row['이름']?.toString() || '',
            row['전화번호']?.toString() || '',
            row['주민등록번호']?.toString() || '',
            row['차트번호']?.toString(),
            row['주소']?.toString(),
            row['메모']?.toString(),
        );
    }

    mergeRows(rows: PatientVO[]): PatientVO[] {
        const result: PatientVO[] = [];
        const map = new Map<string, { row: PatientVO; index: number }>();

        for (const row of rows) {
            const identityKey = row.getIdentityKey();
            const existing = map.get(identityKey);

            if (existing && this.canMerge(existing.row, row)) {
                const merged = existing.row.mergeWith(row);
                result[existing.index] = merged;
                map.set(identityKey, { row: merged, index: existing.index });
            } else {
                const index = result.length;
                result.push(row);
                map.set(identityKey, { row, index });
            }
        }

        return result;
    }

    private isValid(row: PatientVO): boolean {
        return (
            this.isValidName(row.name) &&
            this.isValidPhoneNumber(row.phoneNumber) &&
            this.isValidIdentifyNumber(row.identifyNumber) &&
            this.isValidOptionalField(row.chartNumber) &&
            this.isValidOptionalField(row.address) &&
            this.isValidOptionalField(row.memo)
        );
    }

    private clean(row: PatientVO): PatientVO {
        return new PatientVO(
            row.name.trim(),
            row.phoneNumber.replace(/-/g, ''),
            this.cleanIdentifyNumber(row.identifyNumber),
            row.chartNumber?.trim(),
            row.address?.trim(),
            row.memo?.trim(),
        );
    }

    private isValidName(name?: string): boolean {
        return typeof name === 'string' && name.length >= 1 && name.length <= 255;
    }

    private isValidPhoneNumber(phone?: string): boolean {
        if (!phone) return false;
        return /^\d{11}$/.test(phone.replace(/-/g, '')) || /^\d{3}-\d{4}-\d{4}$/.test(phone);
    }

    private isValidIdentifyNumber(id?: string): boolean {
        if (!id) return false;
        return (
            /^\d{6}$/.test(id) ||
            /^\d{6}[1-4]$/.test(id) ||
            /^\d{6}-?[1-4]$/.test(id) ||
            /^\d{6}-?[1-4]\*{6}$/.test(id) ||
            /^\d{6}-?[1-4]\d{6}$/.test(id)
        );
    }

    private cleanIdentifyNumber(id: string): string {
        const matched = id.match(/^\d{6}-?[1-4]/);
        return matched ? matched[0].replace('-', '') : '0000000';
    }

    private isValidOptionalField(value?: string): boolean {
        return !value || value.length <= 255;
    }

    private canMerge(upper: PatientVO, lower: PatientVO): boolean {
        const upperHasChartNumber = upper.hasChartNumber();
        const lowerHasChartNumber = lower.hasChartNumber();

        // 둘 다 chartNumber가 있으면, 값이 같아야 병합 가능
        if (upperHasChartNumber && lowerHasChartNumber) {
            return upper.isChartNumberEqual(lower);
        }

        // 위에만 chartNumber가 있고 아래는 없어도 → 병합 OK
        if (upperHasChartNumber && !lowerHasChartNumber) return true;

        // 둘 다 없음 → 병합 OK
        if (!upperHasChartNumber && !lowerHasChartNumber) return true;

        // 아래만 chartNumber가 있고 위는 없음 → 병합 x
        return false;
    }
}
