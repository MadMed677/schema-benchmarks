import * as Benchmark from 'benchmark';

Benchmark.options.minSamples = 100;

const Suite = new Benchmark.Suite('yup');

Suite
	.add('RegExp#test', () => {
		return /o/.test('Hello World!');
	})
	.add('String#indexOf', () => {
		return 'Hello World!'.indexOf('o') > -1;
	})
	.on('cycle', function(event) {
		console.log(String(event.target));
	})
	.on('complete', function() {
		console.log('Fastest is ' + this.filter('fastest').map('name'));
	})
	// run async
	.run({ 'async': true })
;
