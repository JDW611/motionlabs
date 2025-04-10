import { GenericRepository } from '@core/database/generic/generic.repository';
import { PatientEntity } from './patient.entity';
import { PatientVO } from '@modules/patient/vo/patient.vo';
import { PaginationDto } from '@modules/patient/dto/request/pagination.dto';
import { PatientFilterDto } from '@modules/patient/dto/request/patient-filter.dto';
import { PaginatedResponseDto } from '@modules/patient/dto/response/paginated-response.dto';

export const PatientRepositoryKey = 'PatientRepositoryKey';

export interface IPatientRepository extends GenericRepository<PatientEntity> {
    upsert(patient: PatientVO[]): Promise<number>;
    findPatients(
        filter: PatientFilterDto,
        pagination: PaginationDto,
    ): Promise<PaginatedResponseDto<PatientEntity>>;
}
