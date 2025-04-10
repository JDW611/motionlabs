import {
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
    Get,
    Query,
    ParseFilePipe,
    FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
    ApiTags,
    ApiOperation,
    ApiConsumes,
    ApiBody,
    ApiOkResponse,
    ApiCreatedResponse,
    ApiBadRequestResponse,
} from '@nestjs/swagger';
import { PatientService } from './patient.service';
import { PaginationDto } from './dto/request/pagination.dto';
import { PatientFilterDto } from './dto/request/patient-filter.dto';
import { PatientResponseDto } from './dto/response/patient-response.dto';
import { PaginatedResponseDto } from './dto/response/paginated-response.dto';
import { ExcelUploadForm } from './schema/upload-excel-form';
import { UploadExcelResult } from './types/parse-result.type';
import { ParseResultForm } from './schema/parse-result-form';

@ApiTags('Patients')
@Controller('patients')
export class PatientController {
    constructor(private readonly patientService: PatientService) {}

    @Post()
    @ApiOperation({
        summary: 'Excel 파일 업로드를 통한 환자 등록',
        description: '엑셀 파일을 업로드하여 환자 데이터를 등록합니다.',
    })
    @UseInterceptors(FileInterceptor('file'))
    @ApiConsumes('multipart/form-data')
    @ApiBody({ type: ExcelUploadForm })
    @ApiCreatedResponse({
        type: () => ParseResultForm,
    })
    @ApiBadRequestResponse({
        status: 400,
        description: '엑셀 파일 확장자 불일치',
    })
    async uploadPatients(
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new FileTypeValidator({
                        fileType:
                            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    }),
                ],
                fileIsRequired: true,
            }),
        )
        file: Express.Multer.File,
    ): Promise<UploadExcelResult> {
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
