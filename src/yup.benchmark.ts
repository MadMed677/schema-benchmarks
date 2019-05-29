import * as Benchmark from 'benchmark';
import Chalk from 'chalk';

import {
	Row,
	Rows,
	Table,
	IReport
} from './entities';

Benchmark.options.minSamples = 1;

const BenchmarkSuite = new Benchmark.Suite('yup');

import * as Mocks from './mocks';

import {
	OrderInfoSimpleRequestScheme
} from './yup.schemes';
import {Event} from 'benchmark';

BenchmarkSuite
	.add('simple request#Imperative', () => {
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
	.add('simple request#Declarative - async#abortEarly=false', () => {
		const request = Mocks.orderInformationRequest.simple.valid;

		return OrderInfoSimpleRequestScheme.validate(
			request,
			{abortEarly: false}
		);
	})
	.add('simple request#Declarative - async#abortEarly=true', () => {
		const request = Mocks.orderInformationRequest.simple.valid;

		return OrderInfoSimpleRequestScheme.validate(
			request,
			{abortEarly: true}
		);
	})
	.add('simple request#Declarative - sync#abortEarly=false', () => {
		const request = Mocks.orderInformationRequest.simple.valid;

		return OrderInfoSimpleRequestScheme.validateSync(
			request,
			{abortEarly: false}
		);
	})
	.add('simple request#Declarative - sync#abortEarly=true', () => {
		const request = Mocks.orderInformationRequest.simple.valid;

		return OrderInfoSimpleRequestScheme.validateSync(
			request,
			{abortEarly: true}
		);
	})
	.on('cycle', (event: Event) => {
		const benchmark = event.target as Benchmark;

		console.log(String(benchmark));
	})
	.on('complete', function(benches) {
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
		console.log('----- ', Chalk.cyanBright('Yup'), ' -----');
		console.log(cliTable.toString());

		console.log('--- ', Chalk.redBright('Slowest'), ' ---');
		console.log('--- ', Chalk.greenBright('Fastest'), ' ---');
		console.log();
	})
	// run async
	.run({ 'async': true })
;
