import * as Benchmark from 'benchmark';
import Chalk from 'chalk';
// @ts-ignore
import * as CliTable from 'cli-table';
import * as D3 from 'd3-format';

import {
	Rows,
	Table,
	IReport
} from './entities';
import {Suite} from 'benchmark';

enum Formats {
	// @ts-ignore
	Number = D3.format(',d'),
	// @ts-ignore
	Percentage = D3.format('.2f'),
	// @ts-ignore
	Integer = D3.format(',')
}

Benchmark.options.minSamples = 1;

const BenchmarkSuite = new Benchmark.Suite('yup');

BenchmarkSuite
	.add('RegExp#test', () => {
		return /o/.test('Hello World!');
	})
	.add('String#indexOf', () => {
		return 'Hello World!'.indexOf('o') > -1;
	})
	.on('cycle', (event) => {
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

		const slowestSuite: Suite = this.filter('slowest')[0];

		const table = new Table({
			definitions: tableDefinition,
			rows: new Rows({
				suites: {
					slowest: slowestSuite
				},
				reports: reports
			})
		});

		console.log('Fastest is ' + this.filter('fastest').map('name'));
		console.log(table.getTable().toString());
	})
	// run async
	.run({ 'async': true })
;
