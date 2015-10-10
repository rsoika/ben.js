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

var BENJS = BENJS || {};

// namespace function (by Stoyan Stefanov - JavaScript Patterns)
BENJS.namespace = function(ns_string) {
	var parts = ns_string.split('.'), parent = BENJS, i;

	// strip redundant leading global
	if (parts[0] === "BENJS") {
		parts = parts.slice(1);
	}

	for (i = 0; i < parts.length; i += 1) {
		// create a property if it dosn't exist yet
		if (typeof parent[parts[i]] === "undefined") {
			parent[parts[i]] = {};
		}
		parent = parent[parts[i]];
	}
	return parent;

};

BENJS.namespace("org.benjs.core");

BENJS.org.benjs.core = (function() {

	console.debug('------------------------');
	console.debug('Ben.js: Version 0.2.0');
	console.debug('------------------------');

	// private properties
	var _controllers = new Array(), _templates = new Array(), _routes = new Array(),

	// private methods
	createController = function(settings) {

		// Force options to be an object
		settings = settings || {};

		if (!settings.id) {
			console
					.error("createController wrong settings provided: id missing!");
			return false;
		}

		console.debug('register new controller: \'' + settings.id + '\'');
		var aController = new BenController(settings);
		_controllers.push(aController);

		return aController;
	},

	createTemplate = function(settings) {

		// Force options to be an object
		settings = settings || {};

		if (!settings.id) {
			console
					.error("createTemplate wrong settings provided: id missing!");
			return false;
		}

		console.debug("register new template: '" + settings.id + "' view='"
				+ settings.url + "'");

		var aTemplate = new BenTemplate(settings);
		_templates.push(aTemplate);

		return aTemplate;

	},

	createRoute = function(settings) {
		// Force options to be an object
		settings = settings || {};

		if (!settings.id) {
			console
					.error("createController wrong settings provided: id missing!");
			return false;
		}

		console.debug('register new route: \'' + settings.id + '\'');

		var aRoute = new BenRouter(settings);
		_routes.push(aRoute);

		return aRoute;

	},

	/**
	 * returns a registered controller by its id.
	 */
	findControllerByID = function(id) {
		var result;
		// iterate over all controllers
		$.each(_controllers, function(index, contrl) {
			if (contrl.id === id) {
				result = contrl;
				// break
				return false;
			}
		});

		if (result)
			return result;
		else
			console.error("ERROR: Controler '" + id + "' not registered");
	},

	/**
	 * returns a registered template by its id.
	 */
	findTemplateByID = function(id) {
		var result;
		// iterate over all controllers
		$.each(_templates, function(index, templ) {
			if (templ.id === id) {
				result = templ;
				// break
				return false;
			}
		});

		if (result)
			return result;
		else
			console.error("ERROR: Template'" + id + "' not registered");
	},

	/**
	 * this method reads all input fields with the attribute 'data-ben-model'
	 * inside the given controller section and updates the corresponding model
	 * value. In case of a getter method the method calls the corresponding 
	 * setter method
	 */
	_read_section = function(selectorId, model) {
		$(selectorId).find(':input').each(function() {
			var modelValue, modelField, methodName;

			// check if input is a data-ben-model
			modelField = $(this).attr("data-ben-model");
			if (modelField) {
				modelField = modelField.trim();
				modelValue = "";
				
				// test input fields
				switch (this.type) {
				case 'text':
				case 'hidden':
				case 'password':
				case 'select-multiple':
				case 'select-one':
				case 'textarea':
					modelValue = $(this).val();
					break;
				case 'checkbox':
				case 'radio':
					this.checked = false;
				}
				// check if data-ben-model is a getter method
				if (modelField.match("^get[_a-zA-Z0-9.]+\\(")) {
					try {
						// convert get in set
						modelField="set"+modelField.substring(3,modelField.length-1);
						// test if setter method is defined
						methodName=modelField.substring(0,modelField.indexOf('('));
						if ($.isFunction(model[methodName])) {
							modelField=modelField+",modelValue)";
							eval('model.' + modelField);
						} else {
							console.warn("setter method '" + methodName + "' is not defined!");
						}
					} catch (err) {
						console.error("Error calling setter-method '"
								+ modelField + "' -> " + err.message);
					}
				} else {
					model[modelField] = modelValue;
				}
			}
		});

	},

	/**
	 * Start the ben Application
	 */
	start = function(config) {
		console.debug("starting application...");

		if (config === undefined) {
			config = {
				"loadTemplatesOnStartup" : true
			};
		}
		console.debug("configuration=", config);

		// first load views for all registered controllers and push the
		// model....
		$.each(_controllers, function(index, contrl) {
			contrl.init();
		});

		// now load templates...
		// _load_templates();
		if (config.loadTemplatesOnStartup) {
			$.each(_templates, function(index, templ) {
				templ.load();
			});
		}
	},

	/**
	 * Controller object
	 * 
	 * @param: settings Type: PlainObject
	 * 
	 * @param: settings.id : identifier (String)
	 * @param: settings.model : model object
	 * @param: settings.view : view template (URL)
	 * @param: settings.autoRefresh: Boolean indicates if the data is pushed
	 *         automatically after content was updated
	 * 
	 */
	BenController = function(settings) {

		// Force settings to be an object
		settings = settings || {};

		var that = this;
		this.id = settings.id;
		this.model = settings.model;
		this.view = settings.view;
		if (typeof settings.autoRefresh == "undefined") {
			this.autoRefresh = true;
		} else {
			this.autoRefresh = settings.autoRefresh;
		}

		this.foreachCache = new Array();

		this.beforePush = $.Callbacks();
		this.afterPush = $.Callbacks();
		this.beforePull = $.Callbacks();
		this.afterPull = $.Callbacks();

		// test callback method
		if (typeof settings.beforePush === "function") {
			this.beforePush.add(settings.beforePush);
		}
		if (typeof settings.afterPush === "function") {
			this.afterPush.add(settings.afterPush);
		}
		if (typeof settings.beforePull === "function") {
			this.beforePull.add(settings.beforePull);
		}
		if (typeof settings.afterPull === "function") {
			this.afterPull.add(settings.afterPull);
		}

		/**
		 * Initializes the controller
		 */
		this.init = function(context) {
			this.foreachCache = new Array();
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
		 * Push the controller model into the controller view. The method tests
		 * for the elements with a 'data-ben-foreach' attribute and iterates
		 * separately over an existing array element.
		 */
		this.push = function(context) {
			var selectorId = "[data-ben-controller='" + this.id + "']", pushContext = $(
					selectorId, context);

			console.debug("controller: '" + that.id + "' -> push model=",
					that.model);
			// callback
			that.beforePush.fire(that, pushContext);
			$(pushContext).each(function() {
				that._update(this, that.model);
			});
			// callback
			that.afterPush.fire(that, pushContext);
		}

		/**
		 * Pulls the model out of the view and update the model data
		 */
		this.pull = function() {
			var selectorId = "[data-ben-controller='" + this.id + "']", pullContext = $(selectorId);

			// callback
			that.beforePull.fire(that, pullContext);
			_read_section(selectorId, this.model);
			console.debug("pull model from view '" + this.id + "': Model=",
					this.model);
			// callback
			that.afterPull.fire(that, pullContext);
		}

		/**
		 * loads a the view for the current controller. If no URL is provided
		 * the method check the view property. If no view provided the url
		 * defaults to id+'.html'
		 */
		this.load = function(url, searchcontext) {
			// reset foreach cache
			this.foreachCache = new Array();

			if (!url) {
				// test view
				if (that.view) {
					url = that.view;
				}
			}
			if (url) {
				var selectorId = "[data-ben-controller='" + this.id + "']";

				// document.body

				$(selectorId, searchcontext)
						.each(
								function() {
									console.debug("controller: '" + that.id
											+ "' -> load '" + url + "'...");
									var context = $(this).parent();
									$(this)
											.load(
													url,
													function(response, status,
															xhr) {

														if (status === "error") {
															// default info
															$(this)
																	.prepend(
																			"<!-- WARNING controller-view '"
																					+ url
																					+ "' not found -->");
															console
																	.debug("controller-view '"
																			+ url
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
		 * This helper method fills a given controller selector with model
		 * objects. Each element with the attribute 'data-ben-model' inside the
		 * section will be filled with the corresponding model value. If no
		 * model value exists the element will be cleared.
		 * 
		 * If the selector contains a data-ben-foreach block the method creates
		 * a separate block for each element of the corresponding data array in
		 * the model. The method makes a recursive call to itself.
		 * 
		 * To refresh a foreach block later with a new push() method call, the
		 * method caches the origin HTML foreach-template of each
		 * data-ben-foreach block. To identify the block the method adds a
		 * data-ben-foreach-id to every foreach block.
		 * 
		 */
		this._update = function(selector, model) {

			/*
			 * First check foreach blocks without an id
			 */
			$(selector).find('[data-ben-foreach]').each(function() {
				var foreachID;
				foreachID = $(this).attr("data-ben-foreach-id");
				if (!foreachID) {
					// add a id
					foreachID = that.foreachCache.length;
					$(this).attr("data-ben-foreach-id", foreachID);
					// add empty bock into the cache
					that.foreachCache.push("");
				}
			});

			/*
			 * test data-ben-model elements..
			 */
			$(selector)
					.find('[data-ben-model]')
					.each(
							function() {

								var modelField, parentForEachBlocks, selectorForEachBlocks;

								modelField = $(this).attr("data-ben-model");
								// console.log("_update: checking
								// data-ben-model=" +
								// modelField);

								// test if parent foeach...
								parentForEachBlocks = $(this).closest(
										'[data-ben-foreach]');
								selectorForEachBlocks = $(selector).closest(
										'[data-ben-foreach]');

								if (parentForEachBlocks.length === 0
										|| $(parentForEachBlocks).get(0) === $(
												selectorForEachBlocks).get(0)) {
									that._update_element(this, modelField,
											model);

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

								var parent, modelField, foreachID, foreachModel, forEachBlock, forEachBlockContent, resolveAs, _prototypeClass;

								modelField = $(this).attr("data-ben-foreach");
								foreachID = $(this).attr("data-ben-foreach-id");

								// support 'as' directive and test for a
								// prototype definition
								if (modelField.indexOf(' as ') > -1) {
									resolveAs = modelField.split(" ");
									modelField = resolveAs[0].trim();
									_prototypeClass = resolveAs[2].trim();
								}

								parent = $(this).parent('[data-ben-foreach]');
								foreachModel = that._extract_model_value(
										modelField, model);

								if (parent.length === 0 && foreachModel
										&& $.isArray(foreachModel)) {
									forEachBlock = $(this);

									// test if content block was cached before?
									if (foreachID) {
										if (foreachID >= that.foreachCache.length) {
											console
													.debug('WARNING - wrong foreachCach length!');
										}
										forEachBlockContent = that.foreachCache[foreachID];
									}
									if (!forEachBlockContent) {
										// not yet cached
										console.debug('caching foreach block: '
												+ foreachID);
										forEachBlockContent = forEachBlock
												.clone().html().trim();
										that.foreachCache[foreachID] = forEachBlockContent;

									}

									// if content block is no valid XHTML or
									// contains more than one child element,
									// surround content with a span to define a
									// valid xhtml element
									if (forEachBlockContent.indexOf('<') != 0
											|| forEachBlockContent
													.indexOf('<!--') === 0) {
										forEachBlockContent = '<span data-ben-entry="">'
												+ forEachBlockContent
												+ '</span>';
									}

									// remove the content which was
									// just the template...
									$(this).empty();
									if ($.isArray(foreachModel)) {
										// copy the content of the
										// data-ben-foreach
										// block
										$
												.each(
														foreachModel,
														function(index,
																model_element) {

															var newEntry, evalString;

															if (_prototypeClass) {
																// eval
																// prototype
																evalString = "model_element =new "
																		+ _prototypeClass
																		+ "(model_element);";

																// Worklist.prototype
																// = new
																// ItemCollection();
																eval(evalString);
															}

															newEntry = $
																	.parseHTML(forEachBlockContent);
															// update entry
															// index
															$(newEntry)
																	.attr(
																			"data-ben-entry",
																			index);

															$(forEachBlock)
																	.append(
																			newEntry);
															that
																	._update(
																			newEntry,
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
			var modelAttribute, attrPos, modelValue;
			if (modelField) {
				// extract attribute tag '::xxx::'
				if (modelField.match("^::")) {
					attrPos = modelField.indexOf("::", 2);
					modelAttribute = modelField.substring(2, attrPos);
					modelField = modelField.substring(attrPos + 2);
				}

				modelValue = that._extract_model_value(modelField, model);

				// test if attribute mode
				if (modelAttribute) {
					$(selector).attr(modelAttribute, modelValue);
				} else
				// test for normal element
				if (!selector.type && $(selector).text) {
					$(selector).html(modelValue);
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
		 * This helper method extract a given model object. The method supports
		 * getter methods on the model and controller object. In this case the
		 * method must be prefixed with model. or controller.
		 * 
		 * @param selectorID -
		 *            jquery selector
		 * @param model -
		 *            modelobject
		 */
		this._extract_model_value = function(modelField, model) {
			var modelValue, methodName;

			if (modelField) {
				// trim
				modelField = modelField.trim();
				// check if data-ben-model is a getter method
				if (modelField.indexOf('(') > -1) {
					if (modelField.match("^[_a-zA-Z0-9.]+\\(")) {
						try {
							// test if method is defined
							methodName=modelField.substring(0,modelField.indexOf('('));
							if ($.isFunction(model[methodName])) {
								modelValue = eval('model.' + modelField);
							} else {
								console.error("Error invalid getter method: "+ modelField );
							}
						} catch (err) {
							console.error("Error calling gettermethod '"
									+ modelField + "' -> " + err.message);
						}
					} else {
						// invalid method call!!
						console.error("Error invalid method call -> "
								+ modelField);
					}
				} else {
					// direct field access - prefix with model.
					// to avoid script injecting

					// check short-cut
					if (modelField === '.') {
						modelValue = model;
					} else {
						if (!modelField.match("^model.")) {
							modelField = "model." + modelField;
						}
						modelValue = eval(modelField);
						// alternative code to avoid eval
						// modelValue = model[modelField];
					}
				}

				if ((typeof (modelValue) === "undefined"))
					modelValue = "";

				return modelValue
			}
		}

	},

	/**
	 * Template object
	 * 
	 * @param: settings Type: PlainObject
	 * 
	 * @param: settings.id : identifier (String)
	 * 
	 */
	BenTemplate = function(settings) {

		// Force options to be an object
		settings = settings || {};

		var that = this;
		this.id = settings.id;
		this.url = settings.url;
		this.beforeLoad = $.Callbacks();
		this.afterLoad = $.Callbacks();

		// test callback method
		if (typeof settings.beforeLoad === "function") {
			this.beforeLoad.add(settings.beforeLoad);
		}
		if (typeof settings.afterLoad === "function") {
			this.afterLoad.add(settings.afterLoad);
		}

		/**
		 * loads the template content defined by the url property
		 * 
		 * @param url -
		 *            optional url defining the content which will be loaded
		 */
		this.load = function(url) {
			if (url) {
				that.url = url;
			}
			if (!that.url) {
				console.debug("Warning: temlate '" + that.id
						+ "' can't be loaded: no url defined!")
				return false;
			}

			var selectorId = "[data-ben-template='" + that.id + "']";

			// document.body

			$(selectorId)
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
													var template_error, templateContext = $(this);

													if (status === "error") {
														// not found!
														template_error = "Error loading template '"
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
														console
																.debug("template: '"
																		+ that.id
																		+ "' loaded");

														// init all controllers
														// in this template....
														$(templateContext)
																.find(
																		'[data-ben-controller]')
																.each(
																		function() {
																			var cntrl = BENJS.org.benjs.core
																					.findControllerByID($(
																							this)
																							.attr(
																									"data-ben-controller"));
																			if (cntrl
																					&& cntrl.autoRefresh === true) {
																				cntrl
																						.init(templateContext);
																			}
																		});

													}

													// callback
													that.afterLoad.fire(that,
															$(templateContext));

												});
							});
		}
	},

	/**
	 * Router object
	 * 
	 * @param: settings Type: PlainObject
	 * 
	 * @param: settings.id : identifier (String)
	 * @param: settings.templates : JSON [template:url]
	 * 
	 */
	BenRouter = function(settings) {

		// Force options to be an object
		settings = settings || {};

		var that = this;
		this.id = settings.id;
		this.templates = settings.templates;

		this.beforeRoute = $.Callbacks();
		this.afterRoute = $.Callbacks();
		this.templateCount = 0;

		// test callback method
		if (typeof settings.beforeRoute === "function") {
			this.beforeRoute.add(settings.beforeRoute);
		}
		if (typeof settings.afterRoute === "function") {
			this.afterRoute.add(settings.afterRoute);
		}

		/**
		 * calls a route.....
		 */
		this.route = function() {
			console.debug("route: '" + that.id + "'...");
			that.beforeRoute.fire(that);

			// load templates
			var keys = Object.keys(that.templates);

			$.each(keys, function(index, templID) {
				var templ = benJS.findTemplateByID(templID);
				if (templ) {
					that.templateCount++;
					templ.afterLoad.add(that._templateOnLoad);
					templ.load(that.templates[templID], false);
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

			if (that.templateCount === 0) {
				// update route...browser url
				document.location.href = "#" + that.id;

				console.debug("route: '" + that.id + "' complete");
				// callback
				that.afterRoute.fire(that);
			}
		}

	}

	// public API
	return {
		start : start,

		createController : createController,
		createTemplate : createTemplate,
		createRoute : createRoute,

		findControllerByID : findControllerByID,
		findTemplateByID : findTemplateByID
	};
}());
