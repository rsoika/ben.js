/**
 * This model element demonstrates getter and setter methods with parameters
 */
function Entity() {
	var that = this;

	this.getElement = function(_name) {
		if (that[_name] === undefined) {
			that[_name] = '';
		}
		console.info("getElement('" + _name + "') == " + that[_name]);
		return that[_name];
	}

	this.setElement = function(_name, newvalue) {
		console.info("setElement('" + _name + "');");
		that[_name] = newvalue;
	}

}

var benJS = BENJS.org.benjs.core;

var Demo = benJS.createController({
	id : "my-controller",
	model : new Entity()
});
