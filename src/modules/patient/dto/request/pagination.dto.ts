import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationDto {
    @ApiProperty({
        description: '페이지 번호 (1부터 시작)',
        default: 1,
        required: false,
    })
    @IsOptional()
    @IsInt()
    @Min(1)
    @Type(() => Number)
    page: number = 1;

    @ApiProperty({
        description: '페이지당 항목 수',
        default: 10,
        required: false,
    })
    @IsOptional()
    @IsInt()
    @Min(1)
    @Type(() => Number)
    count: number = 10;
}
