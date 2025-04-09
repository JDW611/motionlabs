import { Column, Entity, Index } from 'typeorm';
import { BaseTimeEntity } from '@core/database/typeorm/base-time.entity';

@Entity('patients')
@Index(['name', 'phone', 'chartNumber'], { unique: true, where: 'chart_number IS NOT NULL' })
@Index(['name', 'phone'], { unique: true, where: 'chart_number IS NULL' })
export class PatientEntity extends BaseTimeEntity {
    @Column({ type: 'varchar', nullable: true, length: 255 })
    chartNumber: string;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'varchar', length: 11 })
    phone: string;

    @Column({ type: 'varchar', length: 14, nullable: true })
    juminNumber?: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    address?: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    memo?: string;
}
