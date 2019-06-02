import {object, string} from 'yup';

export const YupSimpleSchema = object({
	/** Order identificator */
	id: string().required('required'),

	/** Payer account */
	payerAccount: string().required('required')
});

enum PayMethods {
	Offline = 'offline',
	Online = 'online'
}

export const YupPhoneSchema = object({
	payMethod: string().required('required'),
	phoneNumber: string().when('payMethod', {
		is: PayMethods.Offline,
		then: string()
			.test('check-phone', 'not-valid', function(value) {
				const {path, createError} = this;

				if (!value) {
					return createError({path, message: 'required'});
				}

				const phoneNumberWithoutSymbols = value.replace(/\D/g, '');
				const ALLOWED_PHONE_NUMBER_LENGTH = 11;

				return phoneNumberWithoutSymbols.length === ALLOWED_PHONE_NUMBER_LENGTH;
			})
	})
});

export const YupEmailSchema = object({
	payMethod: string().required('required'),
	email: string().when('payMethod', {
		is: PayMethods.Offline,
		then: string().email('not-valid').required('required')
	})
});
