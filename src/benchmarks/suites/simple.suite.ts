import * as Mocks from '../../mocks';
import * as Validator from "validator";
import {YupSimpleSchema} from '../entities/yup';
import {JoiSimpleSchema} from '../entities/joi/joi.schemes';
import {IReport} from '../../entities/Report';
import * as Benchmark from 'benchmark';
import Chalk from 'chalk';
import {Rows, Table} from '../../entities/Tables';

const SimpleBenchmarkSuite = new Benchmark.Suite('Simple');

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
;

export {SimpleBenchmarkSuite};
