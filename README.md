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

The view in ben.js is the HTML part of your applicaiton. With custom attributes you can bind your view to a controller:

    <div ben-controller="myController" />
       <input type="text" value="" ben-model="myModel" />
       ....
    </div>
    


# The Model

The model can be any JavaScript object. There are no restrictions or specific requirements to the model object:

    
     function Employee(id, city, date) {
       this.id = id;
	   this.city = city;
       this.date = date;
     }

# The Controller

The conroller in ben.js is a 

# Naming conventions    
