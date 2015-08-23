function Employee(name, city, date) {
	this.name = name;
	this.city = city;
	this.date = date;
}

function Company() {
	this.employers = new Array();
	this.employers.push(new Employee('Anna', 'Munich', '19.7.2015'));
	this.employers.push(new Employee('Sam', 'Berlin', '20.7.2015'));
	this.employers.push(new Employee('Douglas', 'Hamburg', '21.7.2015'));
	this.test = "Example Value";

}

var benJS=BENJS.org.benjs.core;
var Demo = benJS.createController("my-controller", new Company());

$(document).ready(function() {
	benJS.start();
});