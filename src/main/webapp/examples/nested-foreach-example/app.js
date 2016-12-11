function Employee(name, city, date, skills) {
	this.name = name;
	this.city = city;
	this.date = date;
	this.skills = skills;
}

function Company() {
	this.employers = new Array();
	this.employers.push(new Employee('Anna', 'Munich', '19.7.2015', [ 'Java',
			'JavaScript', 'C++' ]));
	this.employers.push(new Employee('Sam', 'Berlin', '20.7.2015', [ 'HTML5',
			'CSS3', 'Java' ]));
	this.employers.push(new Employee('Douglas', 'Hamburg', '21.7.2015', [
			'.NET', 'Spring', 'JEE' ]));
	this.test = "Example Value";

}

var benJS = BENJS.org.benjs.core;
var demoController = benJS.createController({
	id : "my-controller",
	model : new Company()
});
