import * as Benchmark from 'benchmark';
import Chalk from 'chalk';
// @ts-ignore
import * as CliTable from 'cli-table';
import * as D3 from 'd3-format';

enum Formats {
	// @ts-ignore
	Number = D3.format(',d'),
	// @ts-ignore
	Percentage = D3.format('.2f'),
	// @ts-ignore
	Integer = D3.format(',')
}

Benchmark.options.minSamples = 1;

interface Report {
	/** Report name */
	name: string;

	/** The number of executions per second */
	hz: number;

	/** The relative margin of error */
	rme: number;

	/** Array of count sampled periods */
	size: number;
	error?: string;
}

const Suite = new Benchmark.Suite('yup');

Suite
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
		const reports: Array<Report> = benches.currentTarget.map((bench) => {
			return {
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

		const table = new CliTable(tableDefinition);

		const slowestReportHz = Math.min(...reports.map((report) => report.hz));
		table.push(...reports.map((report) => {
			const isSlowertReport = report.hz === slowestReportHz;

			const reportName = ((isSlowertReport) => {
				if (isSlowertReport) {
					return Chalk.redBright(report.name);
				}

				if (report.error) {
					return Chalk.redBright(report.name);
				}

				return report.name;
			})(isSlowertReport);

			const row = [
				reportName,
				// @ts-ignore
				Formats.Number(report.hz),
				// @ts-ignore
				`± ${Formats.Percentage(report.rme)} %`,
				// @ts-ignore
				Formats.Integer(report.size)
			];

			return row;
		}));

		console.log('Fastest is ' + this.filter('fastest').map('name'));
		console.log(table.toString());
	})
	// run async
	.run({ 'async': true })
;
