import {YupEmailSchema} from './yup.schemes';
import * as Mocks from '../../mocks';
import {ValidationError} from 'yup';

describe('Yup schemes', () => {
	describe('"YupEmailSchema"', () => {
		test('should have been valid schema', (done) => {
			const request = Mocks.orderInformationRequest.email.valid;

			YupEmailSchema.validate(request, {
				abortEarly: true
			})
				.then((result) => {
					expect(result).toEqual(request);

					done();
				})
				.catch((error) => {
					done.fail(error);
				})
			;
		});

		test('should have been invalid schema', (done) => {
			const request = Mocks.orderInformationRequest.email.invalid;

			YupEmailSchema.validate(request, {
				abortEarly: true
			})
				.then(() => {
					done.fail('Should have been fail');
				})
				.catch((err) => {
					const error = err as ValidationError;

					expect(error).toBeInstanceOf(Error);
					expect(error.path).toBe('email');
					expect(error.message).toBe('not-valid');

					done();
				})
			;
		});
	});
});
