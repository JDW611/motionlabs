import { ErrorCode, ErrorCodes } from '@common/dto/error/error-code.dto';
import { BaseException } from '@core/exceptions/base.exception';

export class ServiceException extends BaseException {
    constructor(readonly errorCode: ErrorCode, message?: string, detail?: any) {
        super(errorCode.status, message || errorCode.message, detail);
    }
}

export const InvalidRequestBodyException = (message?: string, detail?: any): ServiceException => {
    return new ServiceException(ErrorCodes.INVALID_REQUEST_BODY, message, detail);
};

export const EntityNotFoundException = (message?: string, detail?: any): ServiceException => {
    return new ServiceException(ErrorCodes.ENTITY_NOT_FOUND, message, detail);
};
