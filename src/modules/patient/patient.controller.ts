import { Controller, Post, UploadedFile, UseInterceptors, Get, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { PatientService } from './patient.service';
import { PaginationDto } from './dto/request/pagination.dto';
import { PatientFilterDto } from './dto/request/patient-filter.dto';
import { PatientResponseDto } from './dto/response/patient-response.dto';
import { PaginatedResponseDto } from './dto/response/paginated-response.dto';

@ApiTags('Patients')
@Controller('patients')
export class PatientController {
    constructor(private readonly patientService: PatientService) {}

    @Post('upload')
    @ApiOperation({ summary: 'Excel 파일 업로드를 통한 환자 등록' })
    @UseInterceptors(FileInterceptor('file'))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                    description: '환자 데이터가 포함된 Excel 파일',
                },
            },
        },
    })
    async uploadPatients(@UploadedFile() file: Express.Multer.File): Promise<any> {
        return await this.patientService.createPatients(file);
    }

    @Get()
    @ApiOperation({
        summary: '환자 목록 조회',
        description: '환자 목록을 조회합니다. 이름, 전화번호, 차트번호로 필터링 가능합니다.',
    })
    @ApiOkResponse({
        description: '환자 목록 조회 성공',
        type: () => PaginatedResponseDto<PatientResponseDto>,
    })
    async getPatients(
        @Query() paginationDto: PaginationDto,
        @Query() filterDto: PatientFilterDto,
    ): Promise<PaginatedResponseDto<PatientResponseDto>> {
        const result = await this.patientService.findPatients(filterDto, paginationDto);
        return {
            ...result,
            data: result.data.map(patient => PatientResponseDto.fromEntity(patient)),
        };
    }
}
