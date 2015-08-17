/** Model Definition **/
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
}

/** Controller Definition **/
var employerContrl = benJS.createController("employee-controller", new Employee());
var companyContrl = benJS.createController("company-controller", new Company());


employerContrl.save = function(f) {
	// load the form data
	this.pull();
	// add the new employee data into the company model...
	companyContrl.model.employers.push(this.model);
	// load the emloyers view...
	contentTemplate.load("employers.html");
}



/** Template Definition **/
var contentTemplate = benJS.createTemplate("app-content", "employers.html");

/** Router Definition **/
var employeeRoute = benJS.createRoute('employee-route', {
	"app-content" : "employee.html"
});
employeeRoute.beforeRoute.add(function(f) {
	employerContrl.model=new Employee();
});

/** Application setup **/
$(document).ready(function() {
	benJS.start();
});