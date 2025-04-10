import { Module } from '@nestjs/common';
import { CoreModule } from '@core/core.module';
import { ConfigModule } from '@config/config.module';
import { HealthModule } from '@modules/health/health.module';
import { PatientModule } from '@modules/patient/patient.module';

@Module({
    imports: [CoreModule, ConfigModule, HealthModule, PatientModule],
})
export class AppModule {}
