function Employee(name, city, date,skills) {
	this.name = name;
	this.city = city;
	this.date = date;
	this.skills= skills;
}

function Company() {
	this.employers = new Array();
	this.employers.push(new Employee('Anna', 'Munich', '19.7.2015',['a','b','c']));
	this.employers.push(new Employee('Sam', 'Berlin', '20.7.2015',['d','e','f']));
	this.employers.push(new Employee('Douglas', 'Hamburg', '21.7.2015',['g','h','i']));
	this.test = "Example Value";

}

var Demo = benJS.createController("my-controller", new Company());

$(document).ready(function() {
	benJS.start();
});