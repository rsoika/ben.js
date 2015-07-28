var testWorkitemData = "{\"item\":[{\"name\":\"namlasteditor\",\"value\":[\"rsoika\"]},{\"name\":\"_subject\",\"value\":[\"Hello World\"]},{\"name\":\"type\",\"value\":[\"workitem\"]}]}";
var testWorklistData = "{\"entity\":[{\"item\":[{\"name\":\"namlasteditor\",\"value\":[\"anna\"]},{\"name\":\"_subject\",\"value\":[\"Hello Univers\"]},{\"name\":\"type\",\"value\":[\"workitem\"]}]},{\"item\":[{\"name\":\"namlasteditor\",\"value\":[\"rsoika\"]},{\"name\":\"_subject\",\"value\":[\"Hello World\"]},{\"name\":\"type\",\"value\":[\"workitem\"]}]} ]}";

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
	this.test="Example Value";

}

var DemoController = Ben.createController("my-controller", new Company(),"view.html");

var DemoTemplate = Ben.createTemplate("my-template", "template.html");


$(document).ready(function() {
	Ben.start();
});