# Ben.JS

Ben.JS is a JavaScript single-page-application (SPA) framework. It provides a minimalistic model-view-controller 
concept to build SPAs in a easy way. Ben.js is based on jQuery. The framwork was inspired by Googles Angular.js, 
Facebooks react and Ember.js. All these frameworks provide comprehensive libraries predetermined strict patterns. 
In contrast, Ben.JS provides a very clear and simple MVC approach.

##Setup & Installation
To setup ben.js you need to provide jQuery in the latest version and Ben.JS in your html page:

    	<body>
    	   <script type="text/javascript" src="libs/jquery-2.1.4.min.js"></script>
    	   <script type="text/javascript" src="libs/ben.js"></script>
    	   <script type="text/javascript" src="app.js"></script>
    	   .....

### Examples
The project includes a set of example pages giving you an idea how you can use Ben.JS. Just checkout the sources. You can deploy the application on a web server or run the examples locally. 

### Combination with other frameworks
There is no restriction to any JavaScript framework without the need for JQuery. So you are free to combine this framework with any other concept including Angular.js, Ember.js or React.


# The View

The view in Ben.JS is the HTML part of your application. With custom attributes you can bind your view to a controller:

    <div ben-controller="myController" />
       <input type="text" value="" ben-model="city" />
       ....
    </div>
    
Ben.JS will automatically push the model into the view or pulls out any changes to your model if you need to store the model on a server.


# The Model

The model can be any JavaScript object. There are no restrictions or specific requirements to the model object:

    
     function Employee(id, city, date) {
       this.id = id;
       this.city = city;
       this.date = date;
     }



# The Controller

Ben.JS provides a conroller instance for each view which you want to bind to a model. There for you simply call the method createController() to get such an instance. See the following example:

    var Demo = Ben.createController("my-controller", new Employee('Anna',
    		'Munich', '19.7.2015'));


This example creates a new Controller called 'my-controller' with an instance of the Employee Model declared before. The following HTML snipped shows how to define a corresponding view:

    <div ben-controller="my-controller">
       Name: <input type="text" value="" ben-model="name" />
    </div>	
    <input type="button" value="save" onclick="Demo.pull()"  />

Ben.JS will put the name of the Employee into the Input Field when the application is loaded. The save button simply calls the pull() method provided by the controller to update the model with the new data.

# Templates
Ben.JS provides a templating concept which allows you to separate HTML fragments. In the main html page you can define
a template to be loaded in any location. See the following example index.html:

    <?xml version="1.0" encoding="UTF-8"?>
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
    <head><title>Ben.js Demo</title></head>
    <body>
    		<div ben-template="header.html"></div>
    			<div ben-controller="my-controller">
    			</div>
    		<script type="text/javascript" src="../lib/jquery-2.1.4.min.js"></script>
    		<script type="text/javascript" src="..//lib/ben.js"></script>
    		<script type="text/javascript" src="app.js"></script>
     </body>
     </html>

This example will load the 'header.html' at the beginning of the body section.

## View Templates
Ben.JS tries to load a view-template for each controler instance. The naming convention for this template is [Controler-ID].html. So in the example above Ben.JS tries to load the page 'my-controller.html' into the controller section. 
If the view did not exists Ben.JS will print a warning into the browser console. 
You can also define a controller with an alternative view during creation:

    var Demo = Ben.createController("my-controller", new Employee('Anna',
    		'Munich', '19.7.2015'),'my-special-view.html);

Additional you can change the view during runtime by calling the load(url) method from the controller:

    Demo.load('another-view.html');

### for-each templates
A common requireent is to print the content of a data list form the model into the view. For example if you model provides an array of employees form the example above you can define a view to print each emplyee form the list as a separate entry:

    <h3>For-Each Block: count=<span ben-model="model.employers.length"</span></h3>
        <div ben-for-each="employers">
            Name=<span ben-model="name"></span> 
            <br /> 
            City=<span ben-model="city"></span>
            <hr />
        </div

In this example you can see that the data-binding is not restricted to object variables. You can also call functions or combine different elements of you model:

     Fullname: <span ben-model="model.fristname + ' ' + model.lastname"</span>



## Getter Methods
You can also define getter methods in you model object to compute complex data entries. See the 
following example:


    function Employee(id, firstname, lastname) {
       this.id = id;
       this.firstname = firstname;
       this.lastname = lastname;
	    // getter method
       this.getFullname = function() {
		  return firstname + ' ' + lastname;
	   }
    }

To access a getter method in your view you simply add the method into the ben-model attribute:

    <div ben-controller="myController" />
       <h1 ben-model="getFullname()" ></h1>
       ....
    </div>

### Access the model object 
In addition Ben.JS can also pass the current model object to your getter method. 
For example if you have a list of entries in your model than you 
can use the ben-for-each attribute to iterate over all entries. If you add the 'model' into 
your getter method Ben.JS will pas for each iteration the array entry to you getter method. 
See the following example:


    function Company() {
    	this.employers = new Array();
	    this.employers.push(new Employee('Anna', 'Munich', '19.7.2015'));
    	this.employers.push(new Employee('Sam', 'Berlin', '20.7.2015'));
    	this.employers.push(new Employee('Douglas', 'Hamburg', '21.7.2015'));
    	
	    // getter method
       this.getLocation = function(model) {
		  return 'Located in ' + model.citiy;
	   }
    }

View example with a for-each block: 

    <div ben-for-each="employers" />
        <h1 ben-model="getLocation(model)" ></h1>
       ....
     </div>

In this example Ben.JS will pass the employer of each iteration to your getLocation method.

### Access the controller
If you want to get access to the controller you can use the directive 'controller' to pas 
the controller object into your getter method:

      // getter method
       this.getCount = function(controller) {
		  ....
	   }
	   
View example: 

    <div ben-for-each="employers" />
        <h1 ben-model="getCount(controller)" ></h1>
       ....
     </div>




# Routes

tbd. 

# Naming conventions    
There are no special naming conventions in Ben.JS. You are free to build your application in your own style.


##Logging and debugging

Ben.JS prints the result of the different method calls into the browsers log. So you should take a look on the console log if something is not working as expected. 


# Join this Project
If you have any questions or ideas just open a new issue in the issue tracker. https://github.com/rsoika/ben.js/issues
