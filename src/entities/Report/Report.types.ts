export interface IReport {
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

