import { HttpStatus } from '@nestjs/common';

export class ErrorCodeDTO {
    constructor(readonly status: HttpStatus, readonly code: string, readonly message: string) {}
}

export const ErrorCodes = {
    INVALID_REQUEST_BODY: new ErrorCodeDTO(
        HttpStatus.BAD_REQUEST,
        'INVALID_REQUEST_BODY',
        'RequestBody is invalid',
    ),
    ENTITY_NOT_FOUND: new ErrorCodeDTO(
        HttpStatus.NOT_FOUND,
        'ENTITY_NOT_FOUND',
        'Entity Not Found',
    ),
} as const;

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];
