import { GenericTypeOrmRepository } from '@core/database/typeorm/generic-typeorm.repository';
import { Injectable } from '@nestjs/common';
import { PatientEntity } from './patient.entity';
import { IPatientRepository } from './patient-repository.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PatientVO } from '@modules/patient/vo/patient.vo';
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
        let inserted = 0;
        let updated = 0;

        for (const excelRow of excelRows) {
            const existing = await this.repository.findOne({
                where: {
                    name: excelRow.name,
                    phoneNumber: excelRow.phoneNumber,
                },
            });

            if (existing) {
                const excelRowHasChartNumber = excelRow.hasChartNumber();
                const dbHasChartNumber =
                    existing.chartNumber !== null && existing.chartNumber !== undefined;

                // 병합 정책: chart 없는 DB row에 chart 있는 엑셀 row가 오면 덮어쓰기
                if (excelRowHasChartNumber && !dbHasChartNumber) {
                    existing.chartNumber = excelRow.chartNumber;
                }

                if (
                    excelRowHasChartNumber &&
                    dbHasChartNumber &&
                    excelRow.chartNumber !== existing.chartNumber
                ) {
                    // chart 다르면 서로 다른 환자로 간주하고 insert 처리
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

        const processedRows = inserted + updated;

        return processedRows;
    }
}
