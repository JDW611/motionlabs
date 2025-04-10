import { GenericTypeOrmRepository } from '@core/database/typeorm/generic-typeorm.repository';
import { Injectable } from '@nestjs/common';
import { PatientEntity } from './patient.entity';
import { IPatientRepository } from './patient-repository.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindManyOptions, FindOptionsWhere } from 'typeorm';
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
    ) {
        super(repository);
    }

    async upsert(excelRows: PatientVO[]): Promise<number> {
        const keyBy = (name: string, phone: string) => `${name}_${phone}`;
        const keySet = new Set<string>();

        for (const row of excelRows) {
            keySet.add(keyBy(row.name, row.phoneNumber));
        }

        const existingPatients = await this.repository.find({
            where: Array.from(keySet).map(key => {
                const [name, phone] = key.split('_');
                return { name, phoneNumber: phone };
            }),
        });

        const existingMap = new Map(existingPatients.map(e => [keyBy(e.name, e.phoneNumber), e]));

        let inserted = 0;
        let updated = 0;

        for (const excelRow of excelRows) {
            const key = keyBy(excelRow.name, excelRow.phoneNumber);
            const existing = existingMap.get(key);

            if (existing) {
                const hasExcelChart = !!excelRow.chartNumber;
                const hasDbChart = !!existing.chartNumber;

                // 병합 정책: 차트번호가 다르면 새 insert
                if (hasExcelChart && hasDbChart && excelRow.chartNumber !== existing.chartNumber) {
                    await this.repository.insert({
                        name: excelRow.name,
                        phoneNumber: excelRow.phoneNumber,
                        rrn: excelRow.rrn,
                        chartNumber: excelRow.chartNumber,
                        address: excelRow.address,
                        memo: excelRow.memo,
                    });
                    inserted += 1;
                    continue;
                }

                // DB에 차트 없음 → 엑셀에 있으면 덮어쓰기
                if (hasExcelChart && !hasDbChart) {
                    existing.chartNumber = excelRow.chartNumber;
                }

                // 공통 병합
                existing.rrn = excelRow.rrn ?? existing.rrn;
                existing.address = excelRow.address ?? existing.address;
                existing.memo = excelRow.memo ?? existing.memo;

                await this.repository.save(existing);
                updated += 1;
            } else {
                await this.repository.insert({
                    name: excelRow.name,
                    phoneNumber: excelRow.phoneNumber,
                    rrn: excelRow.rrn,
                    chartNumber: excelRow.chartNumber,
                    address: excelRow.address,
                    memo: excelRow.memo,
                });
                inserted += 1;
            }
        }

        return inserted + updated;
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
