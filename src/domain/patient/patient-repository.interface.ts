import { GenericRepository } from '@core/database/generic/generic.repository';
import { PatientEntity } from './patient.entity';
import { PatientVO } from '@modules/patient/vo/patient.vo';

export const PatientRepositoryKey = 'PatientRepositoryKey';

export interface IPatientRepository extends GenericRepository<PatientEntity> {
    upsert(patient: PatientVO[]): Promise<number>;
}
