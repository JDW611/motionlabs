import { GenericTypeOrmRepository } from '@core/database/typeorm/generic-typeorm.repository';
import { Injectable } from '@nestjs/common';
import { PatientEntity } from './patient.entity';
import { IPatientRepository } from './patient-repository.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindManyOptions, FindOptionsWhere, DataSource } from 'typeorm';
import { PatientVO } from '@modules/patient/vo/patient.vo';
import { PatientFilterDto } from '@modules/patient/dto/request/patient-filter.dto';
import { PaginationDto } from '@modules/patient/dto/request/pagination.dto';
import { PaginatedResponseDto } from '@modules/patient/dto/response/paginated-response.dto';

@Injectable()
export class PatientRepository
    extends GenericTypeOrmRepository<PatientEntity>
    implements IPatientRepository
{
    constructor(
        @InjectRepository(PatientEntity)
        protected readonly repository: Repository<PatientEntity>,
        private readonly dataSource: DataSource,
    ) {
        super(repository);
    }

    async upsert(excelRows: PatientVO[]): Promise<void> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // 1. 임시 테이블 생성
            await queryRunner.query(`
            CREATE TEMPORARY TABLE temp_patients (
              name VARCHAR(255) NOT NULL,
              phone_number VARCHAR(11) NOT NULL,
              chart_number VARCHAR(255),
              rrn VARCHAR(8),
              address VARCHAR(255),
              memo VARCHAR(255)
            )
          `);

            // 2. 임시 테이블에 엑셀 데이터 삽입
            for (const row of excelRows) {
                await queryRunner.query(
                    `INSERT INTO temp_patients (name, phone_number, chart_number, rrn, address, memo) 
               VALUES (?, ?, ?, ?, ?, ?)`,
                    [
                        row.name,
                        row.phoneNumber,
                        row.chartNumber || null,
                        row.rrn || null,
                        row.address || null,
                        row.memo || null,
                    ],
                );
            }

            // 3. 신규 환자 삽입 + 이름/전화번호 같은 케이스 제외 삽입
            await queryRunner.query(`
                INSERT INTO patients (name, phone_number, chart_number, rrn, address, memo)
                SELECT 
                  t.name,
                  t.phone_number,
                  t.chart_number,
                  t.rrn,
                  t.address,
                  t.memo
                FROM temp_patients t
                WHERE NOT EXISTS (
                  SELECT 1 
                  FROM patients p
                  WHERE p.name = t.name
                    AND p.phone_number = t.phone_number
                    
                );
              `);

            // 4. 업데이트: 이름+전화번호가 같고 차트번호가 같거나 하나 이상이 NULL인 케이스
            await queryRunner.query(`
                UPDATE patients p
                JOIN temp_patients t
                        ON p.name = t.name
                    AND p.phone_number = t.phone_number
                    AND (p.chart_number = t.chart_number OR p.chart_number IS NULL OR t.chart_number IS NULL)
                SET
                    p.chart_number = CASE
                        WHEN p.chart_number IS NULL AND t.chart_number IS NOT NULL
                            THEN t.chart_number
                        ELSE p.chart_number
                    END,
                    p.rrn = COALESCE(t.rrn, p.rrn),
                    p.address = COALESCE(t.address, p.address),
                    p.memo = COALESCE(t.memo, p.memo)
                WHERE
                (p.chart_number IS NULL
                OR t.chart_number IS NULL
                OR p.chart_number = t.chart_number);
              `);

            // 5. 이름+전화번호가 같고 차트번호가 같은게 없는 경우 삽입
            await queryRunner.query(`
                INSERT INTO patients (name, phone_number, chart_number, rrn, address, memo)
                SELECT t.name, t.phone_number, t.chart_number, t.rrn, t.address, t.memo
                FROM temp_patients t
                WHERE t.chart_number IS NOT NULL
                  AND NOT EXISTS (
                    SELECT 1
                    FROM patients p
                    WHERE p.name = t.name
                      AND p.phone_number = t.phone_number
                      AND p.chart_number = t.chart_number
                  );
                `);

            // 6. 임시 테이블 삭제
            await queryRunner.query(`DROP TEMPORARY TABLE IF EXISTS temp_patients`);

            await queryRunner.commitTransaction();
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
    }

    async findPatients(
        filter: PatientFilterDto,
        pagination: PaginationDto,
    ): Promise<PaginatedResponseDto<PatientEntity>> {
        const where: FindOptionsWhere<PatientEntity> = {};

        if (filter.name) {
            where.name = Like(`%${filter.name}%`);
        }

        if (filter.phoneNumber) {
            where.phoneNumber = Like(`%${filter.phoneNumber}%`);
        }

        if (filter.chartNumber) {
            where.chartNumber = Like(`%${filter.chartNumber}%`);
        }

        const options: FindManyOptions<PatientEntity> = {
            where,
            skip: (pagination.page - 1) * pagination.count,
            take: pagination.count,
            order: {
                id: 'DESC',
            },
        };

        const [items, total] = await this.repository.findAndCount(options);

        return {
            total,
            page: pagination.page,
            count: pagination.count,
            data: items,
        };
    }
}
