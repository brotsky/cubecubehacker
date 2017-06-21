var chai = require('chai');
var bubble = require('../models/Bubble');
const expect = chai.expect;

describe('My unit testing setup', function() {

	it('This should work', function() {
		expect(true).to.be.ok;
	});

	// it('This should fail everytime', function() {
	// 	expect(true).to.not.be.ok;
	// })
});

describe('Bubble Model Functions', function() {

	xit('Disappearing Cluster', function() {
		bubble.truePoints();
		bubble.disappearingCluster();
		expect(true).to.be.ok;
	});

	xit('isBlocker', function() {

		expect(true).to.be.ok;
	});

	xit('compareCluster', function() {

		expect(true).to.be.ok;
	});

	xit('disappearingCluster', function() {

		expect(true).to.be.ok;
	});
});