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
			throw new Error('Field "id" must be present');
		}

		if (!request.payerAccount) {
			throw new Error('Field "payerAccount" must be present');
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
	.on('cycle', (event: Event) => {
		console.log('event.target: ', event.target);
		console.log(String(event.target));
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
				Chalk.yellow('MoE'),
				Chalk.yellow('Runs sampled')
			],
			colAligns: columnAligns
		};

		const slowestSuite: Benchmark.Suite = this.filter('slowest')[0];

		const table = new Table({
			definitions: tableDefinition,
			rows: new Rows({
				suites: {
					slowest: slowestSuite
				},
				reports: reports
			})
		});

		console.log('Fastest is ' + (this as Benchmark.Suite).filter('fastest').map((suite) => suite.name));
		const cliTable = table.addRow(new Row({values: {name: 'Yup'}})).getTable();

		console.log(cliTable.toString());
	})
	// run async
	.run({ 'async': true })
;
