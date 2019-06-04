import CliTable from 'cli-table';
import {Rows} from './Rows/Rows';
import {Row} from './Rows/Row';

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
		this.table = new CliTable(this.definitions);
	}

	private readonly definitions: TableOptions['definitions'];
	private readonly rows: TableOptions['rows'];
	private table: CliTable;

	/** Add now row to the table */
	public addRow(row: Row) {
		this.table.push(row.toJSON());

		return this;
	}

	/** Get full table with all rows */
	public getTable(): CliTable {
		this.table.push(...this.rows.getStringifyRows());

		return this.table;
	}
}
