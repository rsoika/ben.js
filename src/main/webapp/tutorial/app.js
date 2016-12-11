"use strict";

/** Model Definition * */
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
	
	this.getCount = function() {
		return this.employers.length;
	}

}

var benJS = BENJS.org.benjs.core;
/** Controller Definition * */
var employerContrl = benJS.createController({
	id : "employee-controller",
	model : new Employee()
});

var companyContrl = benJS.createController({
	id : "company-controller",
	model : new Company()
});

employerContrl.save = function(f) {
	// load the form data
	this.pull();
	// add the new employee data into the company model...
	companyContrl.model.employers.push(this.model);
	// load the emloyers view...
	contentTemplate.load("employers.html");
}

/** Template Definition * */
var contentTemplate = benJS.createTemplate({
	id : "app-content",
	url : "employers.html"
});

/** Router Definition * */
var employeeRoute = benJS.createRoute({
	id : "employee-route",
	templates : {
		"app-content" : "employee.html"
	},
	beforeRoute : function(f) {
		employerContrl.model = new Employee();
	}
});

