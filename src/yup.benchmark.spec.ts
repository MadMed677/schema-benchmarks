import * as Benchmark from 'benchmark';

Benchmark.options.minSamples = 100;

const Suite = new Benchmark.Suite('yup');

// const test = ([name, initFn, testFn]) => {
//
// };

describe('Yup', () => {
	test('should calculate yup scheme time', () => {
		Suite
			.add('RegExp#test', function() {
				/o/.test('Hello World!');
			})
			.add('String#indexOf', function() {
				'Hello World!'.indexOf('o') > -1;
			})
			// add listeners
			.on('cycle', function(event) {
				console.log(String(event.target));
			})
			.on('complete', function() {
				console.log('Fastest is ' + this.filter('fastest').map('name'));
			})
			// run async
			.run({ 'async': true });

		expect(true).toBe(true);
	});
});
