/**
 * This model element demonstrates getter and setter methods with parameters
 */
function Entity() {
	var that = this;

	var name="";
}

var benJS = BENJS.org.benjs.core;

var Demo = benJS.createController({
	id : "mycontroller",
	model : new Entity()
});

$(document).ready(function() {
	benJS.start();
});