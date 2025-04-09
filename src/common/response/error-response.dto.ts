import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
    @ApiProperty({ description: 'HTTP 상태 코드', example: HttpStatus.BAD_REQUEST })
    code: number;

    @ApiProperty({ description: '오류 메세지', example: 'Invalid request' })
    message: string;

    @ApiProperty({ description: '자세한 오류 정보', nullable: true, required: false })
    detail?: any;
}
