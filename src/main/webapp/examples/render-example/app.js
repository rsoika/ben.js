function Employee(name, department, specialism) {
	this.name = name;
	this.department = department;
	this.specialism = specialism;

	this.isDeveloper = function() {
		return this.department==='Development';
	}
}

var benJS = BENJS.org.benjs.core;

var myController = benJS.createController({
	id : "my-controller",
	model : new Employee('Anna', 'Marketing', '')
});

$(document).ready(function() {
	benJS.start();
});