# Ben.JS

Ben.JS is a tiny small JavaScript single-page-application (SPA) framework. It provides an easy to learn model-view-controller concept to build SPAs in a fast and easy way. Ben.js is based on jQuery. The framework was inspired by Googles Angular.js, Facebooks react and Ember.js. All these frameworks provide comprehensive libraries predetermined strict patterns. In contrast, Ben.JS provides a very clear and simple MVC approach.


Visit the project home for more information: [http://www.benjs.org/](http://www.benjs.org/)



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

## Examples
This project includes a set of example pages giving an idea how to use Ben.JS. Just checkout the sources. The examples can run locally or be deploy as an application on a web server. 

See the Ben.JS [5 Minute Tutorial](http://www.benjs.org/tutorial.html) for first steps. 

## Combination with other frameworks
Ben.JS provides a full working single-page-application framework. There is no restriction to any JavaScript framework without the need for JQuery. So Ben.JS can be combined with any other concept or framework including Angular.js, Ember.js or React.


## Join this Project
If you have any questions post them on http://stackoverflow.com/ and tag your question with 'Ben.JS'. If you have found a problem or got anew ideas just open a new issue in the [issue tracker](https://github.com/rsoika/ben.js/issues).

## License
Ben.JS is free software, because we believe that an open exchange of experiences is fundamental for the development of usefull software. The results of this project are provided under the GNU General Public License.


## Minification

For minifiation of the benjs library we use the yuicompressor. 

Example:

    java -jar yuicompressor-2.4.8.jar ~/git/ben.js/src/main/webapp/ben.js -o ~/git/ben.js/src/main/webapp/ben.min.js
