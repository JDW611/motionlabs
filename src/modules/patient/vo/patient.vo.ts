export class PatientVO {
    constructor(
        readonly name?: string,
        readonly phoneNumber?: string,
        readonly rrn?: string,
        readonly chartNumber?: string,
        readonly address?: string,
        readonly memo?: string,
    ) {}

    getMergeKey(): string {
        return this.chartNumber
            ? `${this.chartNumber}-${this.name}-${this.phoneNumber}`
            : `__NOCHART__-${this.name}-${this.phoneNumber}`;
    }

    getIdentityKey(): string {
        return `${this.name}-${this.phoneNumber}`;
    }

    mergeWith(other: PatientVO): PatientVO {
        return new PatientVO(
            other.name || this.name,
            other.phoneNumber || this.phoneNumber,
            other.rrn || this.rrn,
            other.chartNumber || this.chartNumber,
            other.address || this.address,
            other.memo || this.memo,
        );
    }

    isChartNumberEqual(other: PatientVO): boolean {
        return this.chartNumber === other.chartNumber;
    }

    hasChartNumber(): boolean {
        return !!this.chartNumber;
    }
}
