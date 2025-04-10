import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { PatientService } from './patient.service';

@ApiTags('환자')
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
}
