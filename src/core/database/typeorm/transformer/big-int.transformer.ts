import { ValueTransformer } from 'typeorm';

export class BigintTransformer implements ValueTransformer {
    to(entityValue: bigint) {
        return entityValue;
    }

    from(databaseValue: string): bigint {
        return BigInt(databaseValue);
    }
}
