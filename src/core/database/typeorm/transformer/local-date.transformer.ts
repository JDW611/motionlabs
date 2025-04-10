import { ValueTransformer } from 'typeorm';
import { LocalDate } from '@js-joda/core';
import { DateTimeUtil } from '@common/utils/date-time.util';

export class LocalDateTransformer implements ValueTransformer {
    to(entityValue: LocalDate): Date {
        return DateTimeUtil.toDate(entityValue);
    }

    from(databaseValue: Date): LocalDate {
        return DateTimeUtil.toLocalDate(databaseValue);
    }
}
