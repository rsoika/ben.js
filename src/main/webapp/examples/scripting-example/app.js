function Employee(name, city, date,description) {
	this.name = name;
	this.city = city;
	this.date = date;
	this.description=description;
	
	this.customStyle='font-weight:bold;color:red;';
	
	
	this.upperCase = function(field) {
		console.info('calling model method upperCase');
		return field.toUpperCase();
	}

}
 
var Demo = benJS.createController("my-controller", new Employee('Anna', 'Munich',
		'19.7.2015','some custom text example...'));

$(document).ready(function() {
	benJS.start();
});