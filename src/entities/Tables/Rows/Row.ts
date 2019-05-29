import * as D3 from 'd3-format';

enum Formats {
	// @ts-ignore
	Number = D3.format(',d'),
	// @ts-ignore
	Percentage = D3.format('.2f'),
	// @ts-ignore
	Integer = D3.format(',')
}

interface RowOptions {
	values: {
		/** Row name */
		name: string;

		/** The number of executions per second */
		hz?: number;

		/** How much slower than fastest item */
		stf?: number;

		/** The relative margin of error */
		rme?: number;

		/** Array of count sampled periods */
		size?: number;

		/** Row errors */
		error?: string;
	}
}

/** Table element - Row. Used to render table element */
export class Row {
	constructor(options: RowOptions) {
		this.name = options.values.name;
		this.hz = options.values.hz;
		this.rme = options.values.rme;
		this.stf = options.values.stf;
		this.size = options.values.size;
		this.error = options.values.error;
	}

	/** Row name */
	private readonly name: string;

	/** The number of executions per second */
	private readonly hz?: number;

	/** The relative margin of error */
	private readonly rme?: number;

	/** How much slower than fastest item */
	private readonly stf?: number;

	/** Array of count sampled periods */
	private readonly size?: number;

	/** Row errors */
	private readonly error?: string;

	/** Get table row */
	public toJSON() {
		return [
			this.name,
			// @ts-ignore
			this.hz ? Formats.Number(this.hz) : '',
			// @ts-ignore
			this.stf ? `x${Formats.Number(this.stf)}` : '-',
			// @ts-ignore
			this.size ? Formats.Integer(this.size) : ''
		];
	}
}
