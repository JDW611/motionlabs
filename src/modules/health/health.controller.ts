import { SuccessResponseDto } from '@common/response';
import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('health')
@ApiTags('Health Check API')
export class HealthController {
    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Health Check API', description: '서비스 상태를 확인합니다.' })
    @ApiOkResponse({
        status: HttpStatus.OK,
        description: '서비스가 정상적으로 동작중입니다.',
        type: SuccessResponseDto,
    })
    healthCheck(): string {
        return '서비스가 정상적으로 동작중입니다.';
    }
}
