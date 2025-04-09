import { ValidationError } from '@nestjs/common';
import { InvalidRequestBodyException } from '../service.exception';

export class ClassValidatorExceptionFactory {
    throw(): (errors: ValidationError[]) => void {
        return (errors: ValidationError[]): void => {
            if (!errors.length) return;

            const validationExceptions = errors.map(error => ({
                field: error.property,
                value: error.value,
                constraints: Object.values(error.constraints || {}),
            }));

            throw InvalidRequestBodyException(
                '유효하지 않은 데이터입니다. 확인 후 다시 요청해주세요.',
                {
                    validation: {
                        exceptions: validationExceptions,
                        count: validationExceptions.length,
                    },
                },
            );
        };
    }
}
