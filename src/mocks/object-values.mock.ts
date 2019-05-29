export const orderInformationRequest = {
	simple: {
		valid: {
			id: '24807d22-000f-5000-9000-15053d411c38',
			payerAccount: '2461837451559116101'
		}
	},
	depends: {
		online: {
			payMethod: 'online'
		},
		offline: {
			payMethod: 'offline',
			phoneNumber: '+7 (921) 111 22 33'
		}
	}
};
