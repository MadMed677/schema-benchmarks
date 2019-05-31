import * as Validator from 'validator';
import * as Mocks from '../../mocks';

describe('Validator', () => {
	test('should validate phoneNumber', () => {
		const request = Mocks.orderInformationRequest.phone.offline;

		if (request.payMethod === 'offline') {
			const phoneNumberWithoutSymbols = request.phoneNumber.replace(/\D/g, '');
			const isMobilePhone = Validator.isMobilePhone(phoneNumberWithoutSymbols, 'ru-RU');

			expect(isMobilePhone).toBe(true);
		} else {
			expect(false).toBe(true);
		}
	});
});
