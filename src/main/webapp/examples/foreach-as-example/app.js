BENJS.namespace("sample.app");

// define core module
BENJS.sample.app = (function() {

	var benJS = BENJS.org.benjs.core,

	Boss = function(employee) {
		
		this.name=employee.name;
		
		this.getTask = function() {
			return this.name + " please write some cool sofware ";
			
		};
	},
	
	Employee = function(name, city, date) {
		this.name = name;
		this.city = city;
		this.date = date;

	},

	Company = function() {
		this.employers = new Array();
		this.employers.push(new Employee('Anna', 'Munich', '19.7.2015'));
		this.employers.push(new Employee('Sam', 'Berlin', '20.7.2015'));
		this.employers.push(new Employee('Douglas', 'Hamburg', '21.7.2015'));

	},

	demoController = benJS.createController({
		id : "my-controller",
		model : new Company()
	}),

	/**
	 * Start the ben Application
	 */
	start = function() {
		console.debug("starting application...");

		// start view
		benJS.start();

	};
	
	
	
	// public API
	return { 
		Boss: Boss,
		Employee : Employee,
 		start : start
	};

}());

var app = BENJS.sample.app;

$(document).ready(function() {
	app.start();
});