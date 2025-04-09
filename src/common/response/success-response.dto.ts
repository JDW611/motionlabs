import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class SuccessResponseDto<T> {
    @ApiProperty({ description: '상태 코드', example: HttpStatus.OK })
    code: number;

    @ApiProperty({ description: '성공 메세지', example: 'OK' })
    message: string;

    @ApiProperty({ description: '결과 데이터', nullable: true })
    result?: T;
}
