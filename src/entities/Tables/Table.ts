// @ts-ignore
import * as CliTable from 'cli-table';
import {Rows} from './Rows/Rows';

interface TableOptions {
	/** Table definition (like "head", "colAlign", etc...) */
	definitions: any;

	/** Table rows */
	rows: Rows;
}

export class Table {
	constructor(options: TableOptions) {
		this.definitions = options.definitions;
		this.rows = options.rows;
	}

	private readonly definitions: TableOptions['definitions'];
	private readonly rows: TableOptions['rows'];

	/** Get full table with all rows */
	public getTable(): CliTable {
		const table = new CliTable(this.definitions);

		table.push(...this.rows.getStringifyRows());

		return table;
	}
}
