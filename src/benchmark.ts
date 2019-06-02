import Chalk from 'chalk';

import {
	EmailBenchmarkSuite,
	PhoneBenchmarkSuite,
	SimpleBenchmarkSuite,
} from './benchmarks/suites';

console.log();
console.log('----- ', Chalk.cyanBright('"Yup" / "Joi" / "Validator" modules'), ' -----');

SimpleBenchmarkSuite.run({
	async: true
});

PhoneBenchmarkSuite.run({
	async: true
});

EmailBenchmarkSuite.run({
	async: true
});
