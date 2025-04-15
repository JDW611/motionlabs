import { ApiProperty } from '@nestjs/swagger';

export class UploadExcelResultDto {
    @ApiProperty({
        description: '총 행 수',
        example: 50000,
    })
    totalRows: number;

    @ApiProperty({
        description: '건너뛴 행 수',
        example: 2000,
    })
    skippedRows: number;

    @ApiProperty({
        description: '처리된 행 수',
        example: 48000,
    })
    processedRows: number;
}
