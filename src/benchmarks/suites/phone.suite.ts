import Chalk from 'chalk';
import * as Mocks from '../../mocks';
import {
	IReport,
	Rows,
	Table
} from '../../entities';
import {
	YupEmailSchema,
	YupPhoneSchema,
	YupSimpleSchema,
} from '../../benchmarks/entities/yup';
import * as Benchmark from 'benchmark';
import * as Validator from 'validator';

const PhoneBenchmarkSuite = new Benchmark.Suite('Phone');

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
;

export {PhoneBenchmarkSuite};
