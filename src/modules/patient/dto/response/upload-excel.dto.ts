import { ApiProperty } from '@nestjs/swagger';

export class UploadExcelDto {
    @ApiProperty({
        type: 'string',
        format: 'binary',
        description: '엑셀 파일',
    })
    file: Express.Multer.File;
}
