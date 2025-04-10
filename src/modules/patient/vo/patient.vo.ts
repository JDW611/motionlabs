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
            this.name,
            this.phoneNumber,
            this.rrn || other.rrn,
            this.chartNumber || other.chartNumber,
            this.address || other.address,
            this.memo || other.memo,
        );
    }

    isChartNumberEqual(other: PatientVO): boolean {
        return this.chartNumber === other.chartNumber;
    }

    hasChartNumber(): boolean {
        return !!this.chartNumber;
    }
}
