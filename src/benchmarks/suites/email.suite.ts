import * as Mocks from '../../mocks';
import * as Validator from "validator";
import {YupEmailSchema} from '../entities/yup';
import {JoiEmailSchema} from '../entities/joi/joi.schemes';
import {IReport} from '../../entities/Report';
import * as Benchmark from 'benchmark';
import Chalk from 'chalk';
import {Rows, Table} from '../../entities/Tables';

const EmailBenchmarkSuite = new Benchmark.Suite('Email');

EmailBenchmarkSuite
	.add('Imperative', () => {
		const request = Mocks.orderInformationRequest.email.valid;

		if (!request.payMethod) {
			throw new Error('Field "payMethod" is required');
		}

		if (typeof request.payMethod !== 'string') {
			throw new Error('Field "payMethod" is required');
		}

		if (request.payMethod === 'offline') {
			if (!request.email) {
				throw new Error('Field "email" is required');
			}

			if (typeof request.email !== 'string') {
				throw new Error('Field "email" is required');
			}

			const validateEmail = (email) => {
				const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

				return re.test(email);
			};

			if (!validateEmail(request.email)) {
				throw new Error('Field "email" is not valid');
			}
		}

		return true;
	})
	.add('Validator', () => {
		const request = Mocks.orderInformationRequest.email.valid;

		if (!request.payMethod) {
			throw new Error('Field "payMethod" is required');
		}

		if (typeof request.payMethod !== 'string') {
			throw new Error('Field "payMethod" is required');
		}

		if (request.payMethod === 'offline') {
			if (!request.email) {
				throw new Error('Field "email" is required');
			}

			if (typeof request.email !== 'string') {
				throw new Error('Field "email" is required');
			}

			if (!Validator.isEmail(request.email)) {
				throw new Error('Field "email" is not valid');
			}
		}

		return true;
	})
	.add('Yup / Async / validate', () => {
		const request = Mocks.orderInformationRequest.email.valid;

		return YupEmailSchema.validate(
			request,
			{abortEarly: false}
		);
	})
	.add('Joi / Async / validate', () => {
		const request = Mocks.orderInformationRequest.email.valid;

		return JoiEmailSchema.validate(
			request,
			{abortEarly: false}
		);
	})
	.on('complete', function (benches) {
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
				Chalk.yellow('% of max'),
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
		console.log('----- ', Chalk.cyanBright('"Email" schemes'), ' -----');
		console.log(cliTable.toString());

		console.log('--- ', Chalk.redBright('Slowest'), ' ---');
		console.log('--- ', Chalk.greenBright('Fastest'), ' ---');
		console.log();
	})
;

export {EmailBenchmarkSuite};
