import {IReport} from '../../';
import {Row} from './Row';
import {Suite} from 'benchmark';
import Chalk from 'chalk';

interface RowsOptions {
	reports: Array<IReport>;
	suites: {
		slowest: Suite;
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
			const isSlowestReport = report.name === this.suites.slowest.name;

			const reportName = ((isSlowestReport) => {
				if (isSlowestReport) {
					return Chalk.redBright(report.name);
				}

				if (report.error) {
					return Chalk.redBright(report.name);
				}

				return report.name;
			})(isSlowestReport);

			return new Row({
				values: {
					name: reportName,
					hz: report.hz,
					rme: report.rme,
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
