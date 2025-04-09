import { ValidationError } from 'class-validator';
import { ClassValidatorExceptionFactory } from '../exception.factory';
import { InvalidRequestBodyException } from '@core/exceptions/service.exception';

describe('ClassValidatorExceptionFactory 테스트', () => {
    const factory = new ClassValidatorExceptionFactory();

    it('인자로 넘어온 Errors가 빈 배열인 경우', () => {
        //given
        const errors: ValidationError[] = [];

        //when & then
        expect(() => factory.throw()(errors)).not.toThrow();
    });

    it('인자로 넘어온 Error가 존재하는 경우', () => {
        //given
        const errors: ValidationError[] = [
            {
                property: 'email',
                value: 'invalid-email',
                constraints: {
                    isEmail: 'email must be a valid email address',
                },
            } as ValidationError,
        ];

        //when & then
        expect(() => factory.throw()(errors)).toThrow(
            InvalidRequestBodyException('유효하지 않은 데이터입니다. 확인 후 다시 요청해주세요.'),
        );
    });
});
