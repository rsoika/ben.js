/**
 * Ben.js Copyright (C) 20015, Ralph Soika, https://github.com/rsoika/ben.js
 */

var Ben = new Ben();

function Ben() {

	console.debug('------------------------');
	console.debug('Ben.js: Version 0.0.1');
	console.debug('------------------------');

	var that = this;

	this._controllers = new Array();
	this._routes = new Array();

	this.createController = function(id, model, view, appController) {
		console.debug('register new controller: \'' + id + '\'');
		var aController = new BenController(id, model, view, appController);
		that._controllers.push(aController);
		if (appController)
			return appController;
		else
			return aController;
	}

	this.createRoute = function(url, controllers) {
		console.debug('register new route: \'' + url + '\'');

		var aRoute = new BenRouter(url, controllers);
		that._routes.push(aRoute);

		return aRoute;

	}

	/**
	 * returns a registered controller by its id.
	 */
	this.findControllerByID = function(id) {
		var result;
		// iterate over all controllers
		$.each(Ben._controllers, function(index, contrl) {
			if (contrl.id == id)
				result = contrl;
		});

		if (result)
			return result;
		else
			console.log("ERROR: Controler '" + id + "' not registered");
	}

}

function BenController(id, model, view, controller) {
	var that = this;
	this.id = id;
	this.model = model;
	this.view = view;
	this.controller = controller;

	/**
	 * Initializes the controller
	 */
	this.init = function() {
		console.debug("init controller '" + this.id + "'...");
		if (that.view)
			that.load();
		else
			// no view defined just push the model!
			that.push();
	}

	/**
	 * Pushs the controller model into the controller view. The method tests for
	 * the elements with a 'ben-for-each' attribute and iterates over an
	 * existing array element.
	 */
	this.push = function() {
		console.debug("push model into view '" + this.id + "': Model=",
				this.model);
		var selectorId = "[ben-controller='" + this.id + "']";

		// first look for all ben-foreach blocks.....
		$(selectorId)
				.find('[ben-for-each]')
				.each(
						function() {
							// get the model object...
							var modelField = $(this).attr("ben-for-each");
							var forEachBlock = $(this);
							var forEachBlockContent = forEachBlock.clone()
									.html().trim();
							// in case that the contentblock did not begin with
							// an html
							// tag add one....
							if (!forEachBlockContent.match("^<")) {
								forEachBlockContent = "<span>"
										+ forEachBlockContent + "</span>";
							}
							// remove the content which was just the template...
							$(this).empty();
							if (modelField) {
								var modelValue = model[modelField];
								if ($.isArray(modelValue)) {
									// alert('alles gut');
									// copy the content of the ben-for-each
									// block
									$
											.each(
													modelValue,
													function(index,
															model_element) {
														var newEntry = $
																.parseHTML(forEachBlockContent);
														var entryBlock = $(
																forEachBlock)
																.append(
																		newEntry);
														_update_section(
																newEntry,
																model_element);
													});
								}

							}

						});

		_update_section(selectorId, this.model);

	}

	/**
	 * Pulls the model out of the view and update the model data
	 */
	this.pull = function() {
		var selectorId = "[ben-controller='" + this.id + "']";
		_read_section(selectorId, this.model)
		console.debug("pull model from view '" + this.id + "': Model=",
				this.model);
	}

	/**
	 * loads a the view for the current controller. If no URL is provided the
	 * method check the view property. If no view provided the url defaults to
	 * id+'.html'
	 */
	this.load = function(url) {
		if (!url) {
			// test view
			if (that.view) {
				url = that.view;
			}
		}
		if (url) {
			var selectorId = "[ben-controller='" + this.id + "']";
			$(selectorId).each(
					function() {
						console.debug("load view '" + url + "'...");
						$(this).load(
								url,
								function(response, status, xhr) {
									if (status == "error") {
										// default info
										$(this).prepend(
												"<!-- WARNING controller-view '"
														+ url
														+ "' not found -->");
										console.debug("controller-view '" + url
												+ "' not found!");
										that.push();
									} else {
										// update view
										that.push();
									}
								});
					});
		}
	}
}

function BenRouter(url, controllers) {
	var that = this;
	this.controllers = controllers;
	this.url = url;

	/**
	 * calls a route.....
	 */
	this.route = function() {
		console.debug("route '" + that.url + "'...");

		// load views for all registered controllers and push the model....
		$.each(that.controllers, function(index, contrlid) {

			contrl = Ben.findControllerByID(contrlid);
			if (contrl) {
				contrl.init();
				if (contrl.view)
					contrl.load();
				else
					// no view defined!
					contrl.push();
			}
		});

		// update route...browser url
		document.location.href = "#" + that.url;

	}
}

/**
 * this method searches all 'ben-template' elements and loads its content
 */
function _load_templates() {

	$('[ben-template]').each(function() {

		// check if input is a ben-model
		var url = $(this).attr("ben-template");
		if (url) {
			// load the template...
			$(this).load(url, function(response, status, xhr) {
				if (status == "error") {
					// not found!
					var template_error = "template: '" + url + "' not found";
					console.debug(template_error);
					// $(this).html("<!-- " + template_error + " -->");
				} else {
					console.debug("template: '" + url + "' loaded");
				}
			});
		}
	});

}

/**
 * This function fills a given selector with a model object. Each element with
 * the attribute 'ben-model' inside the section will be filled with the
 * corresponding model value. If no model value exists the element will be
 * cleared. In case the element is a child of a ben-for-each block the element
 * will be ignored (see the push() method).
 * 
 * @param selectorID -
 *            jquery selector
 * @param model -
 *            modelobject
 */
function _update_section(selectorId, model) {

	$(selectorId).find('[ben-model]').each(
			function() {

				// test if the element is a child of a ben-for-each block!
				if (!((typeof selectorId) == "string" && $(this).closest(
						"[ben-for-each]").length > 0)) {
					// check if input is a ben-model
					var modelField = $(this).attr("ben-model");
					if (modelField) {
						// var modelValue = model[modelField];
						// evaluate the model value...
						if (!modelField.match("^model.")) {
							modelField = "model." + modelField;
						}
						var modelValue = eval(modelField);
						if (!modelValue)
							modelValue = "";

						// test for normal element
						if (!this.type && $(this).text) {
							$(this).text(modelValue);
						} else {
							// test input fields
							switch (this.type) {
							case 'text':
							case 'hidden':
							case 'password':
							case 'select-multiple':
							case 'select-one':
							case 'textarea':
								$(this).val(modelValue);
								break;
							case 'checkbox':
							case 'radio':
								this.checked = false;
							}
						}
					}

				}
			});

}

/**
 * this method reads all input fields with the attribute 'ben-model' inside the
 * given controller section and updates the corresponding model value.
 */
function _read_section(selectorId, model) {

	$(selectorId).find(':input').each(function() {
		// $(selectorId).find('[ben-model]').each(function() {

		// check if input is a ben-model
		var modelField = $(this).attr("ben-model");
		if (modelField) {

			var modelValue = "";

			// test input fields
			switch (this.type) {
			case 'text':
			case 'hidden':
			case 'password':
			case 'select-multiple':
			case 'select-one':
			case 'textarea':
				modelValue = $(this).val();
				model[modelField] = modelValue;
				break;
			case 'checkbox':
			case 'radio':
				this.checked = false;
			}

		}
	});

}

$(document).ready(function() {

	console.debug("starting application...");

	// first load views for all registered controllers and push the model....
	$.each(Ben._controllers, function(index, contrl) {
		contrl.init();
	});

	// now load templates...
	_load_templates();

});