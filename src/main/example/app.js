var testWorkitemData = "{\"item\":[{\"name\":\"namlasteditor\",\"value\":[\"rsoika\"]},{\"name\":\"_subject\",\"value\":[\"Hello World\"]},{\"name\":\"type\",\"value\":[\"workitem\"]}]}";
var testWorklistData = "{\"entity\":[{\"item\":[{\"name\":\"namlasteditor\",\"value\":[\"anna\"]},{\"name\":\"_subject\",\"value\":[\"Hello Univers\"]},{\"name\":\"type\",\"value\":[\"workitem\"]}]},{\"item\":[{\"name\":\"namlasteditor\",\"value\":[\"rsoika\"]},{\"name\":\"_subject\",\"value\":[\"Hello World\"]},{\"name\":\"type\",\"value\":[\"workitem\"]}]} ]}";

function Employee(name, city, date) {
	this.name = name;
	this.city = city;
	this.date = date;
}

var Demo = Ben.createController("my-controller", new Employee('Anna',
		'Munich', '19.7.2015'));



//select a new workitem
Demo.initWorkitem = function(f) {
	// replace a model property....
	this.model.name="Hugo";
	
	// replace the model...
	//this.model= new Employee('Hugo', 'Munich', '19.7.2015')
	
	Demo.refresh();
}




$(document)
.ready(
		function() {
		// alert('Start Application');
			//Demo.read();
		});