import { Injectable } from '@nestjs/common';
import { PatientRecord } from '../../../domain/patient/patient-record';
import { ParseResult } from '../types/parse-result.type';
import * as XLSX from 'xlsx';

@Injectable()
export class ExcelParserService {
    parseAndValidate(file: Express.Multer.File): ParseResult {
        const workbook = XLSX.read(file.buffer, { type: 'buffer' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(worksheet);

        const patientVOs = rows.map(row => this.convertToPatientVO(row));

        const validRows: PatientRecord[] = [];
        const invalidRows: PatientRecord[] = [];

        for (const row of patientVOs) {
            if (this.isValid(row)) {
                const cleaned = this.clean(row);
                validRows.push(cleaned);
            } else {
                invalidRows.push(row);
            }
        }

        const totalRows = patientVOs.length;
        const skippedRows = invalidRows.length;
        const processedRows = totalRows - skippedRows;

        return { validRows, totalRows, skippedRows, processedRows };
    }

    private convertToPatientVO(row: any): PatientRecord {
        return new PatientRecord(
            row['이름']?.toString() || '',
            row['전화번호']?.toString() || '',
            row['주민등록번호']?.toString() || '',
            row['차트번호']?.toString(),
            row['주소']?.toString(),
            row['메모']?.toString(),
        );
    }

    mergeRows(rows: PatientRecord[]): PatientRecord[] {
        const groupMap = new Map<string, PatientRecord[]>();

        for (const row of rows) {
            const baseKey = row.getIdentityKey();
            let group = groupMap.get(baseKey);

            if (!group) {
                group = [];
                groupMap.set(baseKey, group);
            }

            if (row.hasChartNumber()) {
                this.handleRowWithChartNumber(row, group);
            } else {
                this.handleRowWithoutChartNumber(row, group);
            }
        }

        return Array.from(groupMap.values()).flat();
    }

    /**
     * 차트번호가 있는 row 처리:
     * 1) 동일한 차트번호를 가진 row가 있으면 해당 row와 병합
     * 2) 없으면 그룹 내에 차트번호가 없는 row가 있다면 그 row와 병합
     * 3) 둘 다 해당하지 않으면 새 항목으로 추가
     */
    private handleRowWithChartNumber(row: PatientRecord, group: PatientRecord[]): void {
        const sameChartNumberRowIndex = group.findIndex(
            existing => existing.chartNumber === row.chartNumber,
        );
        if (sameChartNumberRowIndex !== -1) {
            group[sameChartNumberRowIndex] = group[sameChartNumberRowIndex].mergeWith(row);
            return;
        }

        const noChartNumberRowIndex = group.findIndex(existing => !existing.hasChartNumber());
        if (noChartNumberRowIndex !== -1) {
            group[noChartNumberRowIndex] = group[noChartNumberRowIndex].mergeWith(row);
            return;
        }

        group.push(row);
    }

    /**
     * 차트번호가 없는 row 처리:
     * 그룹 내 마지막 row와 병합하며, 그룹이 비어있으면 새로 추가
     */
    private handleRowWithoutChartNumber(row: PatientRecord, group: PatientRecord[]): void {
        if (group.length > 0) {
            const lastIndex = group.length - 1;
            group[lastIndex] = group[lastIndex].mergeWith(row);
        } else {
            group.push(row);
        }
    }

    private isValid(row: PatientRecord): boolean {
        return (
            this.isValidName(row.name) &&
            this.isValidPhoneNumber(row.phoneNumber) &&
            this.isValidIdentifyNumber(row.rrn) &&
            this.isValidOptionalField(row.chartNumber) &&
            this.isValidOptionalField(row.address) &&
            this.isValidOptionalField(row.memo)
        );
    }

    private clean(row: PatientRecord): PatientRecord {
        return new PatientRecord(
            row.name.trim(),
            row.phoneNumber.replace(/-/g, ''),
            this.cleanIdentifyNumber(row.rrn),
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

    private isValidIdentifyNumber(rrn?: string): boolean {
        if (!rrn) return false;
        return (
            /^\d{6}$/.test(rrn) || // 6자리 숫자 (생년월일)
            /^\d{7,}$/.test(rrn) || // 7자리 이상 숫자 (생년월일 + 성별식별값 이상)
            /^\d{6}-\d{1,}$/.test(rrn) || // 하이픈 포함 형식
            /^\d{6}-?\d{1,}\*+$/.test(rrn) // 뒷자리가 * 마스킹된 경우
        );
    }

    private cleanIdentifyNumber(id: string): string {
        const digitsOnly = id.replace(/\D/g, ''); // 숫자만 추출
        const birthDate = digitsOnly.slice(0, 6);
        const genderDigit = digitsOnly.length >= 7 ? digitsOnly.charAt(6) : '0';

        return `${birthDate}-${genderDigit}`;
    }

    private isValidOptionalField(value?: string): boolean {
        return !value || value.length <= 255;
    }

    private canMerge(upper: PatientRecord, lower: PatientRecord): boolean {
        const upperHasChartNumber = upper.hasChartNumber();
        const lowerHasChartNumber = lower.hasChartNumber();

        // 둘 다 chartNumber가 있으면, 값이 같아야 병합 가능
        if (upperHasChartNumber && lowerHasChartNumber) {
            return upper.isChartNumberEqual(lower);
        }

        return true;
    }
}
