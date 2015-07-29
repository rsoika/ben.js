function Employee(name, city, date,description) {
	this.name = name;
	this.city = city;
	this.date = date;
	this.description=description;
	
	this.style='font-weight:bold;color:red;';

}

var Demo = Ben.createController("my-controller", new Employee('Anna', 'Munich',
		'19.7.2015','some text example...'));

$(document).ready(function() {
	Ben.start();
});