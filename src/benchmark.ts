import Chalk from 'chalk';
import * as Mocks from './mocks';
import * as Benchmark from 'benchmark';
import * as Validator from 'validator';

const BenchmarkSuite = new Benchmark.Suite('Benchmark');

import {
	Rows,
	Table,
	IReport
} from './entities';

import {Event} from 'benchmark';
import {
	YupSimpleSchema,
	YupDependsSchema
} from './benchmarks/yup';
import {JoiSimpleSchema} from './benchmarks/joi/joi.schemes';

BenchmarkSuite
	.add('Yup#simple / Async / validate', () => {
		const request = Mocks.orderInformationRequest.simple.valid;

		return YupSimpleSchema.validate(
			request,
			{abortEarly: false}
		);
	})
	.add('Yup#simple / Async / validate / AbortEarly', () => {
		const request = Mocks.orderInformationRequest.simple.valid;

		return YupSimpleSchema.validate(
			request,
			{abortEarly: true}
		);
	})
	.add('Yup#simple / Sync / validate', () => {
		const request = Mocks.orderInformationRequest.simple.valid;

		return YupSimpleSchema.validateSync(
			request,
			{abortEarly: false}
		);
	})
	.add('Yup#simple / Sync / validate / AbortEarly', () => {
		const request = Mocks.orderInformationRequest.simple.valid;

		return YupSimpleSchema.validateSync(
			request,
			{abortEarly: true}
		);
	})
	.add('Yup#depends / Async / validate', () => {
		const request = Mocks.orderInformationRequest.depends.offline;

		return YupDependsSchema.validate(
			request,
			{abortEarly: false}
		);
	})
	.add('Yup#depends / Async / validate / AbortEarly', () => {
		const request = Mocks.orderInformationRequest.depends.offline;

		return YupDependsSchema.validate(
			request,
			{abortEarly: true}
		);
	})
	.add('Yup#depends / Sync / validate', () => {
		const request = Mocks.orderInformationRequest.depends.offline;

		return YupDependsSchema.validateSync(
			request,
			{abortEarly: false}
		);
	})
	.add('Yup#depends / Sync / validate / AbortEarly', () => {
		const request = Mocks.orderInformationRequest.depends.offline;

		return YupDependsSchema.validateSync(
			request,
			{abortEarly: true}
		);
	})
	.add('Imperative#simple', () => {
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
	.add('#Imperative#depends', () => {
		const request = Mocks.orderInformationRequest.depends.offline;

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
	.add('Validator#simple', () => {
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
	.add('Validator#depends', () => {
		const request = Mocks.orderInformationRequest.depends.offline;

		if (request.payMethod === 'offline') {
			const phoneNumberWithoutSymbols = request.phoneNumber.replace(/\D/g, '');

			return Validator.isMobilePhone(phoneNumberWithoutSymbols, 'ru-RU');
		}

		return true;
	})
	.add('Joi#simple / Async / validate', () => {
		const request = Mocks.orderInformationRequest.simple.valid;

		return JoiSimpleSchema.validate(
			request,
			{abortEarly: false}
		);
	})
	.add('Joi#simple / Async / validate / AbortEarly', () => {
		const request = Mocks.orderInformationRequest.simple.valid;

		return JoiSimpleSchema.validate(
			request,
			{abortEarly: true}
		);
	})
	.on('cycle', (event: Event) => {
		const benchmark = event.target as Benchmark;

		console.log(String(benchmark));
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
		console.log('----- ', Chalk.cyanBright('"Yup" / "Joi" / "Validator" modules'), ' -----');
		console.log(cliTable.toString());

		console.log('--- ', Chalk.redBright('Slowest'), ' ---');
		console.log('--- ', Chalk.greenBright('Fastest'), ' ---');
		console.log();
	})
	.run({async: true})
;
