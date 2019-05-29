import {object, string} from '@hapi/joi';

export const JoiSimpleSchema = object({
	/** Order identificator */
	id: string().required(),

	/** Payer account */
	payerAccount: string().required()
});
