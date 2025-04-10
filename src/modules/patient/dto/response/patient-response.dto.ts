import { ApiProperty } from '@nestjs/swagger';
import { PatientEntity } from '@domain/patient/patient.entity';

export class PatientResponseDto {
    @ApiProperty({
        description: '환자 ID',
        example: 1,
    })
    id: number;

    @ApiProperty({
        description: '환자 차트번호',
        example: 'CH001',
        nullable: true,
    })
    chartNumber: string;

    @ApiProperty({
        description: '환자 이름',
        example: '홍길동',
    })
    name: string;

    @ApiProperty({
        description: '환자 전화번호',
        example: '01012345678',
    })
    phoneNumber: string;

    @ApiProperty({
        description: '환자 주민등록번호 앞자리',
        example: '720101',
        nullable: true,
    })
    rrn?: string;

    @ApiProperty({
        description: '환자 주소',
        example: '서울시 강남구',
        nullable: true,
    })
    address?: string;

    @ApiProperty({
        description: '환자 메모',
        example: '알레르기 유의사항',
        nullable: true,
    })
    memo?: string;

    @ApiProperty({
        description: '생성일시',
        example: '2023-06-01T09:00:00.000Z',
    })
    createdAt: Date;

    @ApiProperty({
        description: '수정일시',
        example: '2023-06-01T09:00:00.000Z',
    })
    updatedAt: Date;

    static fromEntity(entity: PatientEntity): PatientResponseDto {
        const dto = new PatientResponseDto();
        dto.id = entity.id;
        dto.chartNumber = entity.chartNumber;
        dto.name = entity.name;
        dto.phoneNumber = entity.phoneNumber;
        dto.rrn = entity.rrn;
        dto.address = entity.address;
        dto.memo = entity.memo;
        dto.createdAt = entity.createdAt;
        dto.updatedAt = entity.updatedAt;
        return dto;
    }
}
