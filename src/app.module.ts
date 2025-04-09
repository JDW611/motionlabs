import { Module } from '@nestjs/common';
import { CoreModule } from '@core/core.module';
import { ConfigModule } from '@config/config.module';
import { HealthModule } from '@modules/health/health.module';
@Module({
    imports: [CoreModule, ConfigModule, HealthModule],
})
export class AppModule {}
