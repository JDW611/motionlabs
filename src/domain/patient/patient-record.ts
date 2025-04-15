export class PatientRecord {
    constructor(
        readonly name?: string,
        readonly phoneNumber?: string,
        readonly rrn?: string,
        readonly chartNumber?: string,
        readonly address?: string,
        readonly memo?: string,
    ) {}

    getIdentityKey(): string {
        return `${this.name}-${this.phoneNumber}`;
    }

    mergeWith(other: PatientRecord): PatientRecord {
        return new PatientRecord(
            other.name || this.name,
            other.phoneNumber || this.phoneNumber,
            other.rrn || this.rrn,
            other.chartNumber || this.chartNumber,
            other.address || this.address,
            other.memo || this.memo,
        );
    }

    isChartNumberEqual(other: PatientRecord): boolean {
        return this.chartNumber === other.chartNumber;
    }

    hasChartNumber(): boolean {
        return !!this.chartNumber;
    }
}
