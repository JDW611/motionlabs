import { CreateDateColumn, DeleteDateColumn, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { RootEntity } from '../generic/root.entity';
import { LocalDateTime } from '@js-joda/core';
import { DateTimeUtil } from '@common/utils/date-time.util';

export abstract class BaseTimeEntity extends RootEntity {
    @PrimaryColumn({ type: 'int', generated: true })
    id: number;

    @CreateDateColumn({ type: 'timestamp', nullable: false })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', nullable: false })
    updatedAt: Date;

    @DeleteDateColumn({ type: 'timestamp', nullable: true })
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
