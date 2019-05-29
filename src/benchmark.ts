import Chalk from 'chalk';
import * as Mocks from './mocks';
import * as Benchmark from 'benchmark';

const BenchmarkSuite = new Benchmark.Suite('Benchmark');

import {
	Rows,
	Table,
	IReport
} from './entities';

import {Event} from 'benchmark';
import {YupSimpleSchema} from './benchmarks/yup/yup.schemes';
import {JoiSimpleSchema} from './benchmarks/joi/joi.schemes';

BenchmarkSuite
	.add('simple#Imperative', () => {
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
	.add('simple#Yup / Async / isValid', () => {
		const request = Mocks.orderInformationRequest.simple.valid;

		return YupSimpleSchema.validate(
			request,
			{abortEarly: false}
		);
	})
	.add('simple#Yup / Async / isValid / AbourtEarly', () => {
		const request = Mocks.orderInformationRequest.simple.valid;

		return YupSimpleSchema.isValid(
			request,
			{abortEarly: true}
		);
	})
	.add('simple#Yup / Async / AbortEarly', () => {
		const request = Mocks.orderInformationRequest.simple.valid;

		return YupSimpleSchema.validate(
			request,
			{abortEarly: true}
		);
	})
	.add('simple#Yup / Sync / isValid', () => {
		const request = Mocks.orderInformationRequest.simple.valid;

		return YupSimpleSchema.isValidSync(
			request,
			{abortEarly: false}
		);
	})
	.add('simple#Yup / Sync', () => {
		const request = Mocks.orderInformationRequest.simple.valid;

		return YupSimpleSchema.validateSync(
			request,
			{abortEarly: false}
		);
	})
	.add('simple#Yup / Sync / AbortEarly', () => {
		const request = Mocks.orderInformationRequest.simple.valid;

		return YupSimpleSchema.validateSync(
			request,
			{abortEarly: true}
		);
	})
	.add('simple#Joi / Async', () => {
		const request = Mocks.orderInformationRequest.simple.valid;

		return JoiSimpleSchema.validate(
			request,
			{abortEarly: false}
		);
	})
	.add('simple#Joi / Async / AbortEarly', () => {
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
		console.log('----- ', Chalk.cyanBright('"Yup" and "Joi" modules'), ' -----');
		console.log(cliTable.toString());

		console.log('--- ', Chalk.redBright('Slowest'), ' ---');
		console.log('--- ', Chalk.greenBright('Fastest'), ' ---');
		console.log();
	})
	.run({async: true})
;
