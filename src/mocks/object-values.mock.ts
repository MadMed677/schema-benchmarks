export const orderInformationRequest = {
	simple: {
		valid: {
			id: '24807d22-000f-5000-9000-15053d411c38',
			payerAccount: '2461837451559116101'
		}
	},
	phone: {
		online: {
			payMethod: 'online'
		},
		offline: {
			payMethod: 'offline',
			phoneNumber: '+7 (921) 111 22 33'
		}
	},
	email: {
		valid: {
			payMethod: 'offline',
			email: 'mytest@mail.com'
		},
		invalid: {
			payMethod: 'offline',
			email: 'invalid_email@m'
		}
	}
};
