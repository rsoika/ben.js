function Employee(name, city, date) {
	this.name = name;
	this.city = city;
	this.date = date;

}

var Demo = Ben.createController("my-controller", new Employee('Anna', 'Munich',
		'19.7.2015'));

$(document).ready(function() {
	Ben.start();
});