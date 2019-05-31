import {object, string} from '@hapi/joi';

enum PayMethods {
	Offline = 'offline',
	Online = 'online'
}

export const JoiSimpleSchema = object({
	/** Order identificator */
	id: string().required(),

	/** Payer account */
	payerAccount: string().required()
});

export const JoiEmailSchema = object({
	payMethod: string().required(),
	phoneNumber: string().when('payMethod', {
		is: PayMethods.Offline,
		then: string().email()
	})
});
