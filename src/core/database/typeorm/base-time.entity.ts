import { CreateDateColumn, DeleteDateColumn, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { RootEntity } from '../generic/root.entity';
import { LocalDateTime } from '@js-joda/core';
import { DateTimeUtil } from '@common/utils/date-time.util';
import { BigintTransformer } from './transformer';

export abstract class BaseTimeEntity extends RootEntity {
    @PrimaryColumn({ type: 'bigint', generated: true, transformer: new BigintTransformer() })
    id: string;

    @CreateDateColumn({ type: 'timestamptz', nullable: false })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamptz', nullable: false })
    updatedAt: Date;

    @DeleteDateColumn({ type: 'timestamptz', nullable: true })
    deletedAt: Date;

    getCreatedAt(): LocalDateTime {
        return DateTimeUtil.toLocalDateTime(this.createdAt);
    }

    getUpdatedAt(): LocalDateTime {
        return DateTimeUtil.toLocalDateTime(this.updatedAt);
    }

    getDeletedAt(): LocalDateTime {
        return DateTimeUtil.toLocalDateTime(this.deletedAt);
    }
}
