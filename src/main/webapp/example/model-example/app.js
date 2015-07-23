var testWorkitemData = "{\"item\":[{\"name\":\"namlasteditor\",\"value\":[\"rsoika\"]},{\"name\":\"_subject\",\"value\":[\"Hello World\"]},{\"name\":\"type\",\"value\":[\"workitem\"]}]}";
var testWorklistData = "{\"entity\":[{\"item\":[{\"name\":\"namlasteditor\",\"value\":[\"anna\"]},{\"name\":\"_subject\",\"value\":[\"Hello Univers\"]},{\"name\":\"type\",\"value\":[\"workitem\"]}]},{\"item\":[{\"name\":\"namlasteditor\",\"value\":[\"rsoika\"]},{\"name\":\"_subject\",\"value\":[\"Hello World\"]},{\"name\":\"type\",\"value\":[\"workitem\"]}]} ]}";

function Employee(name, city, date) {
	this.name = name;
	this.city = city;
	this.date = date;
	
	
}

var Demo = Ben.createController("my-controller", new Employee('Anna',
		'Munich', '19.7.2015'));


// register a new Route
var IndexRoute=Ben.createRoute('route1',['my-controller']);



//select a new workitem
Demo.initWorkitem = function(f) {
	// replace a model property....
	this.model.name="Hugo";
	
	// replace the model...
	//this.model= new Employee('Hugo', 'Munich', '19.7.2015')
	
	Demo.push();
}





// load a form
Demo.loadForm1 = function(f) {
	var url="form1.html";
	$("#form1").load(
			url,
			function(response, status, xhr) {
				if (status == "error") {
					// default info
					$("#fomr1").html(
							"<p>Form not found</p>");
				} else {
					// update view
					document.location.href="#x";
					Demo.push();
				}
			});
	
	
}





$(document)
.ready(
		function() {
		// alert('Start Application');
			//Demo.read();
		});