var testWorkitemData = "{\"item\":[{\"name\":\"namlasteditor\",\"value\":[\"rsoika\"]},{\"name\":\"_subject\",\"value\":[\"Hello World\"]},{\"name\":\"type\",\"value\":[\"workitem\"]}]}";
var testWorklistData = "{\"entity\":[{\"item\":[{\"name\":\"namlasteditor\",\"value\":[\"anna\"]},{\"name\":\"_subject\",\"value\":[\"Hello Univers\"]},{\"name\":\"type\",\"value\":[\"workitem\"]}]},{\"item\":[{\"name\":\"namlasteditor\",\"value\":[\"rsoika\"]},{\"name\":\"_subject\",\"value\":[\"Hello World\"]},{\"name\":\"type\",\"value\":[\"workitem\"]}]} ]}";

function Employee(name, city, date) {
	this.name = name;
	this.city = city;
	this.date = date;
}

var benJS = BENJS.org.benjs.core;
var DemoController = benJS.createController({
	id : "my-controller",
	model : new Employee('Anna', 'Munich', '19.7.2015')
});

// register template
var Template1 = benJS.createTemplate({
	id : "template1",
	url : "my-template.html",
	beforeLoad : function(f) {
		console.log("App: template loading started");
	},
	afterLoad : function(f) {
		console.log("App: template loading finished");
	}
});

// register a new Route
var Route1 = benJS.createRoute({
	id : "route1",
	templates : {
		"template1" : "my-template.html"
	},
	afterRoute: function(f) {
		console.log("App: router finished");
	}
});


// select a new workitem
DemoController.initWorkitem = function(f) {
	// replace the model...
	this.model = new Employee('Sam', 'Berlin', '20.7.2015')
	this.push();
}

