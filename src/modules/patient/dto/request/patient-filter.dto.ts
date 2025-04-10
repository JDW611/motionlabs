import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class PatientFilterDto {
    @ApiProperty({
        description: '환자 이름 (부분 일치 검색)',
        required: false,
    })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({
        description: '환자 전화번호 (부분 일치 검색)',
        required: false,
    })
    @IsOptional()
    @IsString()
    phoneNumber?: string;

    @ApiProperty({
        description: '환자 차트번호 (부분 일치 검색)',
        required: false,
    })
    @IsOptional()
    @IsString()
    chartNumber?: string;
}
