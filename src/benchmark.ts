import Chalk from 'chalk';
import * as Mocks from './mocks';
import * as Benchmark from 'benchmark';
import * as Validator from 'validator';

const SimpleBenchmarkSuite = new Benchmark.Suite('Simple');
const PhoneBenchmarkSuite = new Benchmark.Suite('Phone');
const EmailBenchmarkSuite = new Benchmark.Suite('Email');

import {
	Rows,
	Table,
	IReport
} from './entities';

import {Event} from 'benchmark';
import {
	YupEmailSchema,
	YupPhoneSchema,
	YupSimpleSchema,
} from './benchmarks/yup';
import {
	JoiEmailSchema,
	JoiSimpleSchema
} from './benchmarks/joi/joi.schemes';

console.log();
console.log('----- ', Chalk.cyanBright('"Yup" / "Joi" / "Validator" modules'), ' -----');

SimpleBenchmarkSuite
	.add('Imperative', () => {
		const request = Mocks.orderInformationRequest.simple.valid;

		if (!request.id) {
			throw new Error('Field "id" is required');
		}

		if (typeof request.id !== 'string') {
			throw new Error('Field "id" is required');
		}

		if (!request.payerAccount) {
			throw new Error('Field "payerAccount" is required');
		}

		if (typeof request.payerAccount !== 'string') {
			throw new Error('Field "payerAccount" is required');
		}

		return true;
	})
	.add('Validator', () => {
		const request = Mocks.orderInformationRequest.simple.valid;

		if (!request.id) {
			throw new Error('Field "id" is required');
		}

		if (Validator.isEmpty(request.id)) {
			throw new Error('Field "id" is required');
		}

		if (!request.payerAccount) {
			throw new Error('Field "payerAccount" is required');
		}

		if (Validator.isEmpty(request.payerAccount)) {
			throw new Error('Field "payerAccount" is required');
		}

		return true;
	})
	.add('Yup / Async / validate', () => {
		const request = Mocks.orderInformationRequest.simple.valid;

		return YupSimpleSchema.validate(
			request,
			{abortEarly: false}
		);
	})
	.add('Yup / Async / validate / AbortEarly', () => {
		const request = Mocks.orderInformationRequest.simple.valid;

		return YupSimpleSchema.validate(
			request,
			{abortEarly: true}
		);
	})
	.add('Yup / Sync / validate', () => {
		const request = Mocks.orderInformationRequest.simple.valid;

		return YupSimpleSchema.validateSync(
			request,
			{abortEarly: false}
		);
	})
	.add('Yup / Sync / validate / AbortEarly', () => {
		const request = Mocks.orderInformationRequest.simple.valid;

		return YupSimpleSchema.validateSync(
			request,
			{abortEarly: true}
		);
	})
	.add('Joi / Async / validate', () => {
		const request = Mocks.orderInformationRequest.simple.valid;

		return JoiSimpleSchema.validate(
			request,
			{abortEarly: false}
		);
	})
	.add('Joi / Async / validate / AbortEarly', () => {
		const request = Mocks.orderInformationRequest.simple.valid;

		return JoiSimpleSchema.validate(
			request,
			{abortEarly: true}
		);
	})
	.on('complete', function (benches) {
		const reports: Array<IReport> = benches.currentTarget.map((bench: Benchmark) => {
			return {
				// @ts-ignore
				name: bench.name,
				hz: bench.hz,
				rme: bench.stats.rme,
				size: bench.stats.sample.length,
				error: bench.error
			};
		});

		const columnAligns: Array<'left' | 'middle' | 'right'> = [
			'left',
			'left',
			'right',
			'right',
			'right'
		];

		const tableDefinition = {
			head: [
				Chalk.blue('Name'),
				Chalk.yellow('Ops/sec'),
				Chalk.yellow('% of max'),
				Chalk.yellow('Runs sampled')
			],
			colAligns: columnAligns
		};

		const slowestSuite: Benchmark.Suite = this.filter('slowest')[0];
		const fastestSuite: Benchmark.Suite = this.filter('fastest')[0];

		const table = new Table({
			definitions: tableDefinition,
			rows: new Rows({
				suites: {
					slowest: slowestSuite,
					fastest: fastestSuite
				},
				reports: reports
			})
		});

		const cliTable = table
			.getTable()
		;

		console.log();
		console.log('----- ', Chalk.cyanBright('"Simple" schemes'), ' -----');
		console.log(cliTable.toString());

		console.log('--- ', Chalk.redBright('Slowest'), ' ---');
		console.log('--- ', Chalk.greenBright('Fastest'), ' ---');
		console.log();
	})
	.run({async: true})
;

PhoneBenchmarkSuite
	.add('Imperative', () => {
		const request = Mocks.orderInformationRequest.phone.offline;

		if (!request.payMethod) {
			throw new Error('Field "payMethod" is required');
		}

		if (request.payMethod === 'offline') {
			if (!request.phoneNumber) {
				throw new Error('Field "phoneNumber" is required');
			}

			const phoneNumberWithoutSymbols = request.phoneNumber.replace(/\D/g, '');
			const ALLOWED_PHONE_NUMBER_LENGTH = 11;

			const isAllowedPhoneNumber = phoneNumberWithoutSymbols.length === ALLOWED_PHONE_NUMBER_LENGTH;

			if (!isAllowedPhoneNumber) {
				throw new Error('Field "phoneNumber" is not valid');
			}
		}

		return true;
	})
	.add('Validator', () => {
		const request = Mocks.orderInformationRequest.phone.offline;

		if (request.payMethod === 'offline') {
			const phoneNumberWithoutSymbols = request.phoneNumber.replace(/\D/g, '');

			return Validator.isMobilePhone(phoneNumberWithoutSymbols, 'ru-RU');
		}

		return true;
	})
	.add('Yup / Async / validate', () => {
		const request = Mocks.orderInformationRequest.phone.offline;

		return YupPhoneSchema.validate(
			request,
			{abortEarly: false}
		);
	})
	.add('Yup / Async / validate / AbortEarly', () => {
		const request = Mocks.orderInformationRequest.phone.offline;

		return YupPhoneSchema.validate(
			request,
			{abortEarly: true}
		);
	})
	.add('Yup / Sync / validate', () => {
		const request = Mocks.orderInformationRequest.phone.offline;

		return YupPhoneSchema.validateSync(
			request,
			{abortEarly: false}
		);
	})
	.add('Yup / Sync / validate / AbortEarly', () => {
		const request = Mocks.orderInformationRequest.phone.offline;

		return YupPhoneSchema.validateSync(
			request,
			{abortEarly: true}
		);
	})
	.on('complete', function (benches) {
		const reports: Array<IReport> = benches.currentTarget.map((bench: Benchmark) => {
			return {
				// @ts-ignore
				name: bench.name,
				hz: bench.hz,
				rme: bench.stats.rme,
				size: bench.stats.sample.length,
				error: bench.error
			};
		});

		const columnAligns: Array<'left' | 'middle' | 'right'> = [
			'left',
			'left',
			'right',
			'right',
			'right'
		];

		const tableDefinition = {
			head: [
				Chalk.blue('Name'),
				Chalk.yellow('Ops/sec'),
				Chalk.yellow('% of max'),
				Chalk.yellow('Runs sampled')
			],
			colAligns: columnAligns
		};

		const slowestSuite: Benchmark.Suite = this.filter('slowest')[0];
		const fastestSuite: Benchmark.Suite = this.filter('fastest')[0];

		const table = new Table({
			definitions: tableDefinition,
			rows: new Rows({
				suites: {
					slowest: slowestSuite,
					fastest: fastestSuite
				},
				reports: reports
			})
		});

		const cliTable = table
			.getTable()
		;

		console.log();
		console.log('----- ', Chalk.cyanBright('"Phone" schemes'), ' -----');
		console.log(cliTable.toString());

		console.log('--- ', Chalk.redBright('Slowest'), ' ---');
		console.log('--- ', Chalk.greenBright('Fastest'), ' ---');
		console.log();
	})
	.run({async: true})
;

EmailBenchmarkSuite
	.add('Imperative', () => {
		const request = Mocks.orderInformationRequest.email.valid;

		if (!request.payMethod) {
			throw new Error('Field "payMethod" is required');
		}

		if (typeof request.payMethod !== 'string') {
			throw new Error('Field "payMethod" is required');
		}

		if (request.payMethod === 'offline') {
			if (!request.email) {
				throw new Error('Field "email" is required');
			}

			if (typeof request.email !== 'string') {
				throw new Error('Field "email" is required');
			}

			const validateEmail = (email) => {
				const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

				return re.test(email);
			};

			if (!validateEmail(request.email)) {
				throw new Error('Field "email" is not valid');
			}
		}

		return true;
	})
	.add('Validator', () => {
		const request = Mocks.orderInformationRequest.email.valid;

		if (!request.payMethod) {
			throw new Error('Field "payMethod" is required');
		}

		if (typeof request.payMethod !== 'string') {
			throw new Error('Field "payMethod" is required');
		}

		if (request.payMethod === 'offline') {
			if (!request.email) {
				throw new Error('Field "email" is required');
			}

			if (typeof request.email !== 'string') {
				throw new Error('Field "email" is required');
			}

			if (!Validator.isEmail(request.email)) {
				throw new Error('Field "email" is not valid');
			}
		}

		return true;
	})
	.add('Yup / Async / validate', () => {
		const request = Mocks.orderInformationRequest.email.valid;

		return YupEmailSchema.validate(
			request,
			{abortEarly: false}
		);
	})
	.add('Joi / Async / validate', () => {
		const request = Mocks.orderInformationRequest.email.valid;

		return JoiEmailSchema.validate(
			request,
			{abortEarly: false}
		);
	})
	.on('complete', function (benches) {
		const reports: Array<IReport> = benches.currentTarget.map((bench: Benchmark) => {
			return {
				// @ts-ignore
				name: bench.name,
				hz: bench.hz,
				rme: bench.stats.rme,
				size: bench.stats.sample.length,
				error: bench.error
			};
		});

		const columnAligns: Array<'left' | 'middle' | 'right'> = [
			'left',
			'left',
			'right',
			'right',
			'right'
		];

		const tableDefinition = {
			head: [
				Chalk.blue('Name'),
				Chalk.yellow('Ops/sec'),
				Chalk.yellow('% of max'),
				Chalk.yellow('Runs sampled')
			],
			colAligns: columnAligns
		};

		const slowestSuite: Benchmark.Suite = this.filter('slowest')[0];
		const fastestSuite: Benchmark.Suite = this.filter('fastest')[0];

		const table = new Table({
			definitions: tableDefinition,
			rows: new Rows({
				suites: {
					slowest: slowestSuite,
					fastest: fastestSuite
				},
				reports: reports
			})
		});

		const cliTable = table
			.getTable()
		;

		console.log();
		console.log('----- ', Chalk.cyanBright('"Email" schemes'), ' -----');
		console.log(cliTable.toString());

		console.log('--- ', Chalk.redBright('Slowest'), ' ---');
		console.log('--- ', Chalk.greenBright('Fastest'), ' ---');
		console.log();
	})
	.run({async: true})
;
