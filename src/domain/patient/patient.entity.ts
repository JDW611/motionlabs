import { Column, Entity, Index, Unique } from 'typeorm';
import { BaseTimeEntity } from '@core/database/typeorm/base-time.entity';

@Entity('patients')
export class PatientEntity extends BaseTimeEntity {
    @Column({ type: 'varchar', nullable: true, length: 255 })
    chartNumber?: string;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'varchar', length: 11 })
    phoneNumber: string;

    @Column({ type: 'varchar', length: 8, nullable: true })
    rrn?: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    address?: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    memo?: string;
}
