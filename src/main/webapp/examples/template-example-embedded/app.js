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
	this.getCount = function() {
		return this.employers.length;
	}

}

var benJS=BENJS.org.benjs.core;

var DemoController = benJS.createController({
	id: "my-controller", 
	model: new Company(),
	view:"view.html"
});

var DemoTemplate = benJS.createTemplate({id:"my-template", url:"template.html"});

