# Ben.JS

Ben.JS is a JavaScript single-page-application (SPA) framework. It provides a minimalistic model-view-controller 
concept to build SPAs in a easy way. Ben.js is based on jQuery. The framwork was inspired by Googles Angular.js, 
Facebooks react and Ember.js. All these frameworks provide comprehensive libraries predetermined strict patterns. 
In contrast, ben.js provides a clear and simple MVC approach.

##Setup & Installation
To setup ben.js you need to provide jQuery in the latest version and ben.js in your html page:

    	<body>
    	   <script type="text/javascript" src="libs/jquery-2.1.4.min.js"></script>
    	   <script type="text/javascript" src="libs/ben.js"></script>
    	   <script type="text/javascript" src="app.js"></script>
    	   .....

### Combination with other frameworks
There is no restriction to any JavaScript framework without the need for JQuery. So you are free to combine this framework with any other concept including Angular.js, Ember.js or React.




# The View

The view in Ben.JS is the HTML part of your applicaiton. With custom attributes you can bind your view to a controller:

    <div ben-controller="myController" />
       <input type="text" value="" ben-model="myModel" />
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

Ben.JS provides a conroller instance for each view which you want to bind to a model. There for you simply call the method createController to get such an instance. See the following example:

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
Ben.JS tries to load a view-template for each created controler. The naming convention for this template is [ID].html. So in the example above Ben.JS tries to load the page 'my-controller.html' into the controller section. 
If the view did not exists Ben.JS will print a warning into the browser console. 
You can also define a controller with an alternative view during creation:

    var Demo = Ben.createController("my-controller", new Employee('Anna',
    		'Munich', '19.7.2015'),'my-special-view.html);

Additional you can change the view during runtime by calling the load(url) method from the controller:

    Demo.load('another-view.html');



# Routes


# Naming conventions    
There are not much naming conventions in Ben.JS. You are free to build your application in your own style.
If you define a controller Ben.JS tries to load the corresponging view based on the ID of the controller.
For that you should provide a view template for each controller.
Example:

    var Demo = Ben.createController("my-controller", model);
    // view-template should be named: my-controller.html



