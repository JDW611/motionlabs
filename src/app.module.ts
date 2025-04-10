import { Module } from '@nestjs/common';
import { CoreModule } from '@core/core.module';
import { ConfigModule } from '@config/config.module';
import { PatientModule } from '@modules/patient/patient.module';

@Module({
    imports: [CoreModule, ConfigModule, PatientModule],
})
export class AppModule {}
