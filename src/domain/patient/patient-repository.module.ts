import { ClassProvider, Module } from '@nestjs/common';
import { PatientRepository } from './patient.respository';
import { PatientRepositoryKey } from './patient-repository.interface';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientEntity } from './patient.entity';

const patientRepository: ClassProvider = {
    provide: PatientRepositoryKey,
    useClass: PatientRepository,
};

@Module({
    imports: [TypeOrmModule.forFeature([PatientEntity])],
    providers: [patientRepository],
    exports: [patientRepository],
})
export class PatientRepositoryModule {}
