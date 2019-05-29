import {IReport} from '../../';
import {Row} from './Row';
import {Suite} from 'benchmark';
import Chalk from 'chalk';

interface RowsOptions {
	reports: Array<IReport>;
	suites: {
		slowest?: Suite;
		fastest?: Suite;
	}
}

export class Rows {
	constructor(options: RowsOptions) {
		this.reports = options.reports;
		this.suites = options.suites;
	}

	private readonly reports: RowsOptions['reports'];
	private readonly suites: RowsOptions['suites'];

	/** Get all rows */
	private getAllRows(): Array<Row> {
		return this.reports.map((report) => {
			// @ts-ignore suite has property "name"
			const isSlowestReport = Boolean(this.suites.slowest) && report.name === this.suites.slowest.name;

			// @ts-ignore suite has property "name"
			const isFastestReport = Boolean(this.suites.fastest) && report.name === this.suites.fastest.name;

			const colorize = ((isSlowestReport, isFastestReport) => {
				if (isSlowestReport) {
					return Chalk.redBright;
				}

				if (isFastestReport) {
					return Chalk.greenBright;
				}

				if (report.error) {
					return Chalk.redBright;
				}

				return (value) => value;
			})(isSlowestReport, isFastestReport);

			return new Row({
				values: {
					name: colorize(report.name),
					hz: report.hz,
					rme: report.rme,
					// @ts-ignore
					stf: isFastestReport ? 100 :  report.hz / 128282727 * 100,
					size: report.size,
					error: report.error
				}
			});
		});
	}

	public getStringifyRows(): Array<Array<string>> {
		return this.getAllRows().map((row) => row.toJSON());
	}
}
