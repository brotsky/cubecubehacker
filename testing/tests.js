const chai = require('chai');

const expect = chai.expect;

describe('My unit testing setup', function() {

	it('This should work', function() {
		expect(true).to.be.ok;
	});

	it('This should fail everytime', function() {
		expect(true).to.not.be.ok;
	})
});