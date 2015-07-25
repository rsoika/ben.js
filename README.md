# Ben.JS

Ben.JS is a tiny small JavaScript single-page-application (SPA) framework. It provides an easy to learn model-view-controller concept to build SPAs in a fast and easy way. Ben.js is based on jQuery. The framework was inspired by Googles Angular.js, Facebooks react and Ember.js. All these frameworks provide comprehensive libraries predetermined strict patterns. In contrast, Ben.JS provides a very clear and simple MVC approach.

##Setup & Installation
Ben.JS is based on jQuery. To setup Ben.JS at least the latest jQuery version need to be provided:

    	<body>
    	   <script type="text/javascript" src="libs/jquery-2.1.4.min.js"></script>
    	   <script type="text/javascript" src="libs/ben.js"></script>
    	   <script type="text/javascript" src="app.js"></script>
    	   .....

### Examples
This project includes a set of example pages giving an idea how to use Ben.JS. Just checkout the sources. The examples can run locally or be deploy as an application on a web server. 

### Combination with other frameworks
Ben.JS provides a full working single-page-application framework. There is no restriction to any JavaScript framework without the need for JQuery. So Ben.JS can be combined with any other concept or framework including Angular.js, Ember.js or React.


# The Model-View-Controller (MVC) Concept
Ben.JS is based on a simple Model-View-Controller (MVC) pattern. This pattern separates an application into logical build blocks. The following section will explain the concept: 

## The Model

A model in Ben.JS can be any JavaScript object. There are no restrictions or specific requirements to the model object. The following example defines an Employee object with three properties:
    
     function Employee(id, city, date) {
       this.id = id;
       this.city = city;
       this.date = date;
     }


## The Controller

A controller is used to bind a model to a view. Ben.JS provides the method 'crateController()' to create a new instance of a controller. The method expects an ID and a Model Object and binds the model automatically to the view. See the following example creates a new controller with the ID 'my-controller' and binds a new model object of the Employee object declared before:

    var Demo = Ben.createController("my-controller", new Employee('Anna',
    		'Munich', '19.7.2015'));


## The View

The view in Ben.JS is simply any HTML part inside the application. A view is bound to a controller which encapsulates the view. With the custom attribute 'ben-model' a model object provided by the controller can be bound to any HTML element inside the view. The following example shows how the controller created before can be placed in a view:

    <div ben-controller="myController" />
       <input type="text" value="" ben-model="city" />
       ....
    </div>
    
Ben.JS will put the name of the Employee into the Input Field when the application is loaded.

The data-binding of Ben.JS is not restricted to object variables. It is also possible to call functions of a model object or combine different elements of a model. In this case the model property need to be prefixed with the 'model.' directive to valid expression:

     Fullname: <span ben-model="model.fristname + ' ' + model.lastname"</span>


### Pull and Push the model
Ben.JS will automatically push the model provided by the controller into the view when the controller was loaded. To pull any changes of the model back into the controller the method 'pull()' can be called. 
The following HTML fragment how to define an action button to update the model of a controller instance:

    <div ben-controller="my-controller">
       Name: <input type="text" value="" ben-model="name" />
    </div>	
    <input type="button" value="save" onclick="Demo.pull()"  />

The save button simply calls the pull() method provided by the controller to update the model with the new data entered by the user. Note: It is not necessary that this action is placed inside the controller view. The pull() method of a controller can be called in any situation. 



# Templates
Ben.JS provides a templating concept which allows to separate a page into logical HTML fragments. To define a new template the method createTemplate() is called. The method returns an instance of a template. See the following example:

    var DemoTemplate = Ben.createTemplate("my-template","some.html");

A template is defined by an ID and an optional HTML page which will be loaded automatically during startup.
In the main HTML page a template can be placed in any location using the tag 'ben-template'. The following example shows how to define templates in a index.html:

    <?xml version="1.0" encoding="UTF-8"?>
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
    <head><title>Ben.js Demo</title></head>
    <body>
    		<div ben-template="header-template"></div>
    		<div ben-template="body-template"></div>
    		<div ben-template="footer-template"></div>
    		<script type="text/javascript" src="../lib/jquery-2.1.4.min.js"></script>
    		<script type="text/javascript" src="..//lib/ben.js"></script>
    		<script type="text/javascript" src="app.js"></script>
     </body>
     </html>

This example will load three template in the body section. A Template can contain HTML and also controllers which will be initialized automatically by the template. If no default HTML view is defined, the template body can be used to define a default view of a template:

    		<div ben-template="header-template">
    			<h1>Some default content....</h1>
    		</div>

The method 'load()' from the template instance can be used to reload the content of a template during run-time.

    DemoTemplate.load("another.html");
 
If the HTML page page of a template did not exists Ben.JS will print a warning into the browser console. 


## View Templates
Ben.JS is able to load a separate HTML template inside a controller. These templates are called "view-template".
A view-template can be defined optional during creation:

    var DemoController = Ben.createController("my-controller", new Employee('Anna',
    		'Munich', '19.7.2015'),'my-special-view.html');

In this example the controller will automatically load the view-template 'my-special-view.html' during the initializing phase. It is also possible to change the view-template during runtime by calling the load(url) method from the controller:

    DemoController.load('another-view.html');

If the HTML view did not exists Ben.JS will print a warning into the browser console. 

## for-each templates
A common requirement is to print the content of a data list form the model into the view. For example if the model contains an array of employees form the example above a view can be defined to print each employee object as an separate entry. The tag 'ben-for-each' is used to define a for-each template:

    <h3>For-Each Block: count=<span ben-model="model.employers.length"</span></h3>
        <div ben-for-each="employers">
            Name=<span ben-model="name"></span> 
            <br /> 
            City=<span ben-model="city"></span>
            <hr />
        </div

Ben.JS will automatically iterate over the model object 'employers' and generates for each entry a HTML fragment. This example above shows that the data-binding is not restricted to object variables. It is also possible to call functions of a model object.

# Getter Methods
Ben.JS supports the concept of getter methods in a model object. Those methods can be used to compute complex data entries. The following example shows how a getter method is used to compute the property 'fullname':


    function Employee(id, firstname, lastname) {
       this.id = id;
       this.firstname = firstname;
       this.lastname = lastname;
	    // getter method
       this.getFullname = function() {
		  return firstname + ' ' + lastname;
	   }
    }

To access a getter method in a view the method can be placed into the ben-model attribute:

    <div ben-controller="myController" />
       <h1 ben-model="getFullname()" ></h1>
       ....
    </div>

## Access the model object 
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

## Access the controller
To get access to the controller the directive 'controller' can be used to pas the controller object into a getter method:

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
If you have any questions post them on http://www.http://stackoverflow.com/ and tag your question with 'Ben.JS'. If you have found a problem or got anew ideas just open a new issue in the issue tracker. https://github.com/rsoika/ben.js/issues
