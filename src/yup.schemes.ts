import {object, string} from 'yup';

export const OrderInfoSimpleRequestScheme = object({
	/** Order identificator */
	id: string().required('required'),

	/** Payer account */
	payerAccount: string().required('required')
});
