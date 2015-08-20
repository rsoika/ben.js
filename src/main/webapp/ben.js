/*******************************************************************************
 * Ben.JS Copyright (C) 2015, Ralph Soika https://github.com/rsoika/ben.js
 * 
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation; either version 2 of the License, or (at your option) any later
 * version.
 * 
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU General Public License for more
 * details.
 * 
 * You can receive a copy of the GNU General Public License at
 * http://www.gnu.org/licenses/gpl.html
 * 
 * Project: https://github.com/rsoika/ben.js
 * 
 * Contributors: Ralph Soika - Software Developer
 ******************************************************************************/

"use strict";

var Ben = function() {
	console.debug('------------------------');
	console.debug('Ben.js: Version 0.0.8');
	console.debug('------------------------');

	var that = this;
	this._controllers = new Array();
	this._templates = new Array();
	this._routes = new Array();

	this.createController = function(id, model, view) {
		console.debug('register new controller: \'' + id + '\'');
		var aController = new BenController(id, model, view);
		that._controllers.push(aController);
		return aController;
	}

	this.createRoute = function(url, controllers) {
		console.debug('register new route: \'' + url + '\'');

		var aRoute = new BenRouter(url, controllers);
		that._routes.push(aRoute);

		return aRoute;

	}

	this.createTemplate = function(id, url) {
		console.debug("register new template: '" + id + "' view='" + url + "'");

		var aTemplate = new BenTemplate(id, url);
		that._templates.push(aTemplate);

		return aTemplate;

	}

	/**
	 * returns a registered controller by its id.
	 */
	this.findControllerByID = function(id) {
		var result;
		// iterate over all controllers
		$.each(that._controllers, function(index, contrl) {
			if (contrl.id == id) {
				result = contrl;
				// break
				return false;
			}
		});

		if (result)
			return result;
		else
			console.error("ERROR: Controler '" + id + "' not registered");
	}

	/**
	 * returns a registered template by its id.
	 */
	this.findTemplateByID = function(id) {
		var result;
		// iterate over all controllers
		$.each(that._templates, function(index, templ) {
			if (templ.id == id) {
				result = templ;
				// break
				return false;
			}
		});

		if (result)
			return result;
		else
			console.error("ERROR: Template'" + id + "' not registered");
	}

	/**
	 * Start the ben Application
	 */
	this.start = function(config) {

		if (config == undefined) {
			config = {
				"loadTemplatesOnStartup" : true
			};
		}
		console.debug("starting application...");

		console.debug("configuration=", config);
		// jQuery.ajaxSetup({
		// // Disable caching of AJAX responses
		// cache: false
		// });

		// first load views for all registered controllers and push the
		// model....
		$.each(that._controllers, function(index, contrl) {
			contrl.init();
		});

		// now load templates...
		// _load_templates();
		if (config.loadTemplatesOnStartup) {
			$.each(that._templates, function(index, templ) {
				templ.load();
			});
		}
	}

};

function BenController(id, model, view) {
	var that = this;
	this.id = id;
	this.model = model;
	this.view = view;
	//this.controller = controller;
	this.beforePush = $.Callbacks();
	this.afterPush = $.Callbacks();
	this.beforePull = $.Callbacks();
	this.afterPull = $.Callbacks();

	/**
	 * Initializes the controller
	 */
	this.init = function(context) {	
		var selectorId = "[data-ben-controller='" + this.id + "']";
		if ($(selectorId, context).length) {
			console.debug("controller: '" + this.id + "' init...");
			if (that.view)
				that.load(that.view, context);
			else
				// no view defined just push the model! 
				that.push(context);
		}
	}

	/**
	 * Push the controller model into the controller view. The method tests for
	 * the elements with a 'data-ben-foreach' attribute and iterates separately
	 * over an existing array element.
	 */
	this.push = function(context) {
		var selectorId = "[data-ben-controller='" + this.id + "']";

		console.debug("controller: '" + that.id + "' -> push model=",
				that.model);
		// callback
		that.beforePush.fire(that);
		$(selectorId, context).each(function() {

			// _update_section(this, that.model, that);
			that._update(this, that.model);

		});
		// callback
		that.afterPush.fire(that);

	}

	

	/**
	 * Pulls the model out of the view and update the model data
	 */
	this.pull = function() {
		// callback
		that.beforePull.fire(that, $(this));
		var selectorId = "[data-ben-controller='" + this.id + "']";
		_read_section(selectorId, this.model)
		console.debug("pull model from view '" + this.id + "': Model=",
				this.model);
		// callback
		that.afterPull.fire(that, $(this));
	}

	/**
	 * loads a the view for the current controller. If no URL is provided the
	 * method check the view property. If no view provided the url defaults to
	 * id+'.html'
	 */
	this.load = function(url, searchcontext) {
		if (!url) {
			// test view
			if (that.view) {
				url = that.view;
			}
		}
		if (url) {
			var selectorId = "[data-ben-controller='" + this.id + "']";

			// document.body

			$(selectorId, searchcontext).each(
					function() {
						console.debug("controller: '" + that.id + "' -> load '"
								+ url + "'...");
						var context = $(this).parent();
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
										that.push(context);
									} else {
										// update view
										that.push(context);
									}
								});
					});
		}
	}
	
	/**
	 * This helper method fills a given selector with a model object. Each
	 * element with the attribute 'data-ben-model' inside the section will be
	 * filled with the corresponding model value. If no model value exists the
	 * element will be cleared. In case the element is a child of a
	 * data-ben-foreach block the new elements will be created for each entry in
	 * the model object. The method makes a recursive call to itself.
	 * 
	 * 
	 */
	this._update = function(selector, model) {
		// console.log('_update starting...');

		/*
		 * test data-ben-model elements..
		 */
		$(selector).find('[data-ben-model]').each(
				function() {

					var modelField = $(this).attr("data-ben-model");
					// console.log("_update: checking data-ben-model=" +
					// modelField);

					// test if parent foeach...
					var parentForEachBlocks = $(this).closest(
							'[data-ben-foreach]');
					var selectorForEachBlocks = $(selector).closest(
							'[data-ben-foreach]');

					if (parentForEachBlocks.length === 0
							|| $(parentForEachBlocks).get(0) === $(
									selectorForEachBlocks).get(0)) {
						that._update_element(this, modelField, model);

					} else {
						// child element - do skip!
					}
				});

		/*
		 * now test data-ben-foreach blocks with recursive call
		 */
		$(selector)
				.find('[data-ben-foreach]')
				.each(
						function() {
							var modelField = $(this).attr("data-ben-foreach");
							var _prototypeClass;
							
							// support 'as' directive and test for a prototype definition
							if (modelField.indexOf(' as ')>-1) {
								res = modelField.split(" ");
								modelField=res[0].trim();
								_prototypeClass=res[2].trim();
							}
							
							
							var parent = $(this).parent('[data-ben-foreach]');
							var foreachModel = that._extract_model_value(modelField,
									model);

							if (parent.length === 0 && foreachModel
									&& $.isArray(foreachModel)) {
								var forEachBlock = $(this);
								var forEachBlockContent = forEachBlock.clone()
										.html().trim();
								// if content block is no valid XHTML or
								// contains more than one child element,
								// surround content with a span to define a
								// valid xhtml element
								if (forEachBlockContent.indexOf('<') != 0
										|| forEachBlockContent.indexOf('<!--') === 0
										|| $(this).children().length > 1) {
									forEachBlockContent = '<span data-ben-entry="">'
											+ forEachBlockContent + '</span>';
								}

								// remove the content which was
								// just the template...
								$(this).empty();
								if ($.isArray(foreachModel)) {
									// copy the content of the data-ben-foreach
									// block
									$
											.each(
													foreachModel,
													function(index,
															model_element) {

														if (_prototypeClass) {
															// eval prototype
															var evalString="model_element =new "+_prototypeClass + "(model_element);";
															            
															// Worklist.prototype = new ItemCollection();
															eval(evalString);
														}
														
														var newEntry = $
																.parseHTML(forEachBlockContent);
														// update entry index
														$(newEntry)
																.attr(
																		"data-ben-entry",
																		index);

														var entryBlock = $(
																forEachBlock)
																.append(
																		newEntry);

														// that._update(bereich,
														// model_element);
														that._update(newEntry,
																model_element);

													});
								}
							}

						});

	}

	
	
	/**
	 * This helper method fills a given element with a model object.
	 * 
	 * @param selectorID -
	 *            jquery selector
	 * @param model -
	 *            modelobject
	 */
	this._update_element = function(selector, modelField, model) {
		var modelAttribute;
		if (modelField) {
			// extract attribute tag '::xxx::'
			if (modelField.match("^::")) {
				var n = modelField.indexOf("::", 2);
				modelAttribute = modelField.substring(2, n);
				modelField = modelField.substring(n + 2);
			}

			var modelValue = that._extract_model_value(modelField, model);

			// test if attribute mode
			if (modelAttribute) {
				$(selector).attr(modelAttribute, modelValue);
			} else
			// test for normal element
			if (!selector.type && $(selector).text) {
				$(selector).text(modelValue);
			} else {
				// test input fields
				switch (selector.type) {
				case 'text':
				case 'hidden':
				case 'password':
				case 'select-multiple':
				case 'select-one':
				case 'textarea':
					$(selector).val(modelValue);
					break;
				case 'checkbox':
				case 'radio':
					$(selector).checked = false;
				}
			}

		}

	}
	
	

	/**
	 * This helper method extract a given model object. The method supports getter
	 * methods on the model and controller object. In this case the method must be
	 * prefixed with model. or controller.
	 * 
	 * @param selectorID -
	 *            jquery selector
	 * @param model -
	 *            modelobject
	 */
	this._extract_model_value = function(modelField, model) {
		if (modelField) {
			var modelValue;
			// check if data-ben-model is a getter method
			if (modelField.indexOf('(') > -1) {
				if (modelField.match("^[_a-zA-Z0-9]+\\(")) {
					try {
						modelValue = eval('model.' + modelField);
					} catch (err) {
						console.error("Error calling gettermethod '" + modelField
								+ "' -> " + err.message);
					}
				} else {
					// invalid method call!!
					console.error("Error invalid method call -> " + modelField);
				}
			} else {
				// direct field access - prefix with model.
				// to avoid script injecting

				// check short-cut
				if (modelField === '.') {
					modelField = "model";
				} else {
					if (!modelField.match("^model.")) {
						modelField = "model." + modelField;
					}
				}
				modelValue = eval(modelField);
			}

			if ((typeof (modelValue) == "undefined"))
				modelValue = "";

			return modelValue;

		}

	}


	
}

function BenTemplate(id, url) {
	var that = this;
	this.id = id;
	this.url = url;
	this.beforeLoad = $.Callbacks();
	this.afterLoad = $.Callbacks();

	/**
	 * loads the template content defined by the url property
	 */
	this.load = function(url,searchcontext) {
		if (url) {
			that.url=url;
		}			
		if (!that.url) {
			return false;
		}

		var selectorId = "[data-ben-template='" + that.id + "']";

		// document.body

		$(selectorId, searchcontext)
				.each(
						function() {
							console.debug("template: '" + that.id
									+ "' -> load '" + that.url + "'...");
							// callback
							that.beforeLoad.fire(that, $(this));
							// load the template...
							$(this)
									.load(
											that.url,
											function(response, status, xhr) {
												var templateContext = $(this);
												if (status == "error") {
													// not found!
													var template_error = "Error loading template '"
															+ that.url
															+ "': not found";
													console
															.error(template_error);
													$(this)
															.prepend(
																	"<!-- "
																			+ template_error
																			+ " -->");

												} else {
													console.debug("template: '"
															+ that.id
															+ "' loaded");
													// init all controllers in
													// this template....
													$(templateContext)
															.find(
																	'[data-ben-controller]')
															.each(
																	function() {
																		var cntrl = benJS
																				.findControllerByID($(
																						this)
																						.attr(
																								"data-ben-controller"));
																		if (cntrl)
																			cntrl
																					.init(templateContext);
																	});

												}

												// callback
												that.afterLoad.fire(that,
														$(templateContext));

											});
						});
	}
}

function BenRouter(id, config) {
	var that = this;
	this.id = id;
	this.config = config;
	this.beforeRoute = $.Callbacks();
	this.afterRoute = $.Callbacks();
	this.templateCount = 0;

	/**
	 * calls a route.....
	 */
	this.route = function() {
		console.debug("route: '" + that.id + "'...");
		that.beforeRoute.fire(that);

		// load templates
		var keys = Object.keys(that.config);

		$.each(keys, function(index, templID) {
			var templ = benJS.findTemplateByID(templID);
			if (templ) {
				templ.url = that.config[templID];
				templ.afterLoad.add(that._templateOnLoad);
				that.templateCount++;
				templ.load();
			}
		});

	}

	/*
	 * Callback method to monitor template loading
	 */
	this._templateOnLoad = function(templ) {
		// unregister callback...
		templ.afterLoad.remove(that._templateOnLoad);
		that.templateCount--;

		if (that.templateCount == 0) {
			// update route...browser url
			document.location.href = "#" + that.id;

			console.debug("route: '" + that.id + "' complete");
			// callback
			that.afterRoute.fire(that);
		}
	}
}


/**
 * this method reads all input fields with the attribute 'data-ben-model' inside
 * the given controller section and updates the corresponding model value.
 */
function _read_section(selectorId, model) {
	$(selectorId).find(':input').each(function() {
		// $(selectorId).find('[data-ben-model]').each(function() {

		// check if input is a data-ben-model
		var modelField = $(this).attr("data-ben-model");
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

// create the ben instance
var benJS = new Ben();