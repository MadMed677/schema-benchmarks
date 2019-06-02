import {JoiEmailSchema} from './joi.schemes';
import * as Mocks from '../../../mocks';
import {ValidationError} from '@hapi/joi';

describe('Joi schemes', () => {
	describe('"JoiEmailSchema"', () => {
		test('should have been valid schema', (done) => {
			const request = Mocks.orderInformationRequest.email.valid;

			JoiEmailSchema.validate(request, {
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

			JoiEmailSchema.validate(request, {
				abortEarly: true
			})
				.then(() => {
					done.fail('Should have been fail');
				})
				.catch((err) => {
					const error = (err as ValidationError);

					expect(error.message).toBe('child "email" fails because ["email" must be a valid email]');

					done();
				})
			;
		});
	});
});
