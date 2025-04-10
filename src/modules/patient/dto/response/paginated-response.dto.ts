import { ApiProperty } from '@nestjs/swagger';

export class PaginatedResponseDto<T> {
    @ApiProperty({
        description: '전체 데이터 개수',
        example: 120,
    })
    total: number;

    @ApiProperty({
        description: '현재 페이지 번호',
        example: 1,
    })
    page: number;

    @ApiProperty({
        description: '페이지당 항목 수',
        example: 10,
    })
    count: number;

    @ApiProperty({
        description: '조회된 데이터 목록',
        isArray: true,
        type: 'object',
    })
    data: T[];
}
