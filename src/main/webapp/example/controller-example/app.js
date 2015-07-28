var testWorkitemData = "{\"item\":[{\"name\":\"namlasteditor\",\"value\":[\"rsoika\"]},{\"name\":\"_subject\",\"value\":[\"Hello World\"]},{\"name\":\"type\",\"value\":[\"workitem\"]}]}";
var testWorklistData = "{\"entity\":[{\"item\":[{\"name\":\"namlasteditor\",\"value\":[\"anna\"]},{\"name\":\"_subject\",\"value\":[\"Hello Univers\"]},{\"name\":\"type\",\"value\":[\"workitem\"]}]},{\"item\":[{\"name\":\"namlasteditor\",\"value\":[\"rsoika\"]},{\"name\":\"_subject\",\"value\":[\"Hello World\"]},{\"name\":\"type\",\"value\":[\"workitem\"]}]} ]}";

function Employee(name, city, date) {
	this.name = name;
	this.city = city;
	this.date = date;
}

var DemoController = Ben.createController("my-controller", new Employee('Anna', 'Munich',
		'19.7.2015'));

// register template
var Template1 = Ben.createTemplate("template1", "my-template.html");
Template1.beforeLoad.add(function(f) {
	console.log("App: template loading started");
});
Template1.afterLoad.add(function(f) {
	console.log("App: template loading finished");
});
// register a new Route
var Route1 = Ben.createRoute('route1', {
	"template1" : "my-template.html"
});
Route1.afterRoute.add(function(f) {
	console.log("App: router finished");
});

// select a new workitem
DemoController.initWorkitem = function(f) {
	// replace the model...
	this.model = new Employee('Sam', 'Berlin', '20.7.2015')
	this.push();
}

$(document).ready(function() {
	Ben.start();
});