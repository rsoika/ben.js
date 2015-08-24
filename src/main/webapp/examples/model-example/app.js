function Employee(name, city, date) {
	this.name = name;
	this.city = city;
	this.date = date;

}

var benJS = BENJS.org.benjs.core;

var Demo = benJS.createController({
	id : "my-controller",
	model : new Employee('Anna', 'Munich', '19.7.2015')
});

$(document).ready(function() {
	benJS.start();
});