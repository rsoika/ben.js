
##Setup & Installation
Ben.JS is based on jQuery. To setup Ben.JS at least the latest jQuery version need to be provided:

    	<body>
    	   <script type="text/javascript" src="libs/jquery-2.1.4.min.js"></script>
    	   <script type="text/javascript" src="libs/ben.js"></script>
    	   <script type="text/javascript" src="app.js"></script>
    	   .....
    	   <script>
    	      $(document).ready(function() {
				 benJS.start();
			  });
			</script>


#The Model-View-Controller (MVC) Concept
Ben.JS is based on a simple Model-View-Controller (MVC) pattern. This pattern separates an application into logical building blocks. The following section will explain this concept: 

##The Model

A model in Ben.JS can be any JavaScript object. There are no restrictions or specific requirements to design the model object. The following example defines an Employee object with 3 properties:
    
     function Employee(id, city, date) {
       this.id = id;
       this.city = city;
       this.date = date;
     }


## The Controller

A controller is used to bind a model to a view. Ben.JS provides the method 'crateController()' to create a new instance of a controller. The method expects an ID, to identify the controller, and a Model Object. The following example creates a new controller with the ID 'my-controller' and an instance of the Employee model object declared in the examaple before:

    var DemoController = benJS.createController("my-controller", new Employee('Anna',
    		'Munich', '19.7.2015'));


## The View

The view in Ben.JS can be any HTML segment within the application. A view is bound to a controller which encapsulates the view using the custom attribute 'data-ben-controller'. The following example shows how the controller with the id 'my-controller' defines a view segment:

    <div data-ben-controller="my-controller" />
       <input type="text" value="" data-ben-model="city" />
       ID=<span data-ben-model="id" />
       ....
    </div>
    
Inside a view the custom attribute 'data-ben-model' is used to bind a property, provided by the controllers model object, to an HTML element. In the example above, Ben.JS will put automatically the name of the Employee into the Input Field and display the 'id' when the application is loaded.


### Pull and Push the model
Ben.JS automatically pushs the model provided by the controller into the view. To pull any changes out of the view back into the controllers model, the method 'pull()' can be called. The following example shows an action used to update the model object of the controller:

    <div data-ben-controller="my-controller">
       Name: <input type="text" value="" data-ben-model="name" />
    </div>	
    <input type="button" value="save" onclick="DemoController.pull()"  />

The save button in this example simply calls the pull() method provided by the controller to update the model with the new data entered by the user. Note: It is not necessary that this action is placed inside the controller view. The pull() method of a controller can be called in any situation. 



# Templates
Ben.JS provides a templating concept which allows to separate a page into logical HTML fragments. To define a new template the method createTemplate() is called. The method returns an instance of a template. See the following example:

    var DemoTemplate = benJS.createTemplate("my-template","some.html");

A template is defined by an ID and an optional HTML page which will be loaded automatically during startup.
In the main HTML page a template can be placed at any location using the tag 'data-ben-template'. The following example shows how to define templates in a index.html:

    <?xml version="1.0" encoding="UTF-8"?>
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
    <head><title>Ben.js Demo</title></head>
    <body>
    		<div data-ben-template="header-template"></div>
    		<div data-ben-template="body-template"></div>
    		<div data-ben-template="footer-template"></div>
    		<script type="text/javascript" src="../lib/jquery-2.1.4.min.js"></script>
    		<script type="text/javascript" src="..//lib/ben.js"></script>
    		<script type="text/javascript" src="app.js"></script>
     </body>
     </html>

This example defines three templates in the body section. The HTML fragment of a template will be loaded during startup. A Template can contain controllers which will be initialized automatically by the template. If no default HTML view is defined, the template body can be used to define a default view of a template:

    		<div data-ben-template="header-template">
    			<h1>Some default content....</h1>
    		</div>

The method 'load()' from the template instance can be used to reload the content of a template during run-time.

    DemoTemplate.load("another.html");
 
If the HTML page can not be loaded, Ben.JS will print a warning into the browser console. 


## View Templates
Ben.JS is able to load a separate HTML template inside a controller view. These templates are called "view-template". A view-template can be defined optional during creation:

    var DemoController = benJS.createController("my-controller", new Employee('Anna',
    		'Munich', '19.7.2015'),'my-special-view.html');

In this example the controller will automatically load the view-template 'my-special-view.html' during the initializing phase. It is also possible to change the view-template of a controller during runtime by calling the load(url) method:

    DemoController.load('another-view.html');

## for-each templates
A common requirement is to print the content of a data list form the model into the view. For example if the model contains an array of employees form the example above, a view can be defined to print each employee object as an separate entry. The tag 'data-ben-foreach' is used to define a for-each template:

    <h3>For-Each Block: count=<span data-ben-model="employers.length"</span></h3>
    <div data-ben-foreach="employers">
         Name=<span data-ben-model="name"></span> 
         <br /> 
         City=<span data-ben-model="city"></span>
         <hr />
    </div

Ben.JS will automatically iterate over the model object 'employers' and generates for each entry a HTML fragment. 

# Getter Methods
Ben.JS supports the concept of getter methods on a model object. Those methods can be used to compute complex data entries. The following example shows how a getter method is used to compute the property 'fullname':


    function Employee(id, firstname, lastname) {
       this.id = id;
       this.firstname = firstname;
       this.lastname = lastname;
	    // getter method
       this.getFullname = function() {
		  return firstname + ' ' + lastname;
	   }
    }

To access a getter method in a view the method can be placed into the data-ben-model attribute:

    <div data-ben-controller="myController" />
       <h1 data-ben-model="getFullname()" ></h1>
       ....
    </div>

Note: A getter method can only be called on the model object of the controller. 

## Access the model object 
In addition Ben.JS can also pass the current model object in a data-ben-foreach iteration into a getter method. See the following example:


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

    <div data-ben-foreach="employers" />
        <h1 data-ben-model="getLocation(model)" ></h1>
       ....
     </div>

In this example Ben.JS will pass the employer of each iteration into the getter method 'getLocation(model)'.


## Setting Attributes

An alternative to fill the content of an element using the data-ben-model attribute you can also control an existing attribute of a HTML tag. There for you need to grasp the model expression in '::'. See the following example which computes a style class and a image src tag based on the model Attributes 'customStyle' and 'imageURL':

     <p data-ben-model="::class::customStyle"> 
     <img ben-data-model="::src::imageURL" />



#Routes

Routes are used to navigate inside the application.  aBen.JS provides a router concept which allows to define different states on an application. To define a new route the method createRoute() is called. The method returns an instance of a route. See the following example:

    Route1 = benJS.createRoute('route1', {"template1" : "my-template.html" });

The method expects an ID and a route description containing an array of templates. When a route is called Ben.JS automatically refreshes all defined templates.

    <input type="button" value="route back" onclick="Route1.route();" />


#Callbacks
Ben.JS supports the jQuery callback functions (http://api.jquery.com/jQuery.Callbacks/) to allow an application to hook into different events triggered by Templates or Routes. The following callbacks are defined:

 * Template.beforeLoad
 * Template.afterLoad
 * Router.beforeLoad
 * Router.afterLoad

The following example shows how to register a callback function for a route

     Route1.afterRoute.add(function(f) {
	    console.log("App: route finished");
     });

A typical usecase for a callback method is the Template.afterLoad callback which can be used to start a ajax request to load data after the template was loaded into the page.

    Route1.afterRoute.add( function (router) {
	  $.getJSON(
			"/backlog/rest-service/",function(data) {
				myController.model = data;
				myController.push();
			});
    });


# Naming conventions    
There are no special naming conventions in Ben.JS. You are free to build your application in your own style.


##Logging and debugging

Ben.JS prints the result of the different method calls into the browsers log. So you should take a look on the console log if something is not working as expected. 

