/**
 * Expandable.js
 * 
 * A lightweight Javascript package providing expandable / collapsable behavior for HTML elements
 * 
 * Copyright (c) 2019 Chris Campbell; License: MIT
 * 
 * GitHub repo: https://github.com/christophertcampbell/expandable.js
 */

( function() {

	function Expandable() {

		/**
		 * Returns a new configuration object, ready
		 * to configure and pass to expand / collapse methods
		 */
		function getNewConfig() {
			return {
				classOnCollapsed: "",
				classOnExpanded: ""
			}
		}

		function registerToggle(toggleSelector, targetSelector, config) {
			handleRegisterToggle(toggleSelector, targetSelector, config, "toggle");
		}

		function registerExpander(toggleSelector, targetSelector, config) {
			handleRegisterToggle(toggleSelector, targetSelector, config, "expand");
		}

		function registerCollapser(toggleSelector, targetSelector, config) {
			handleRegisterToggle(toggleSelector, targetSelector, config, "collapse");
		}

		/**
		 * Registers a toggle, its target(s) and config
		 * 
		 * Provides single-line implementation of Expandable
		 * Handles event listener and all behavior
		 * 
		 * @param {string} toggleSelector 
		 * @param {string} targetSelector 
		 * @param {object} config 
		 * @param {string} mode The mode to register for ("expand", "collapse", or "toggle" (default))
		 */
		function handleRegisterToggle(toggleSelector, targetSelector, config, mode) {
			var toggles = document.querySelectorAll(toggleSelector);
			if (!toggles || !targetSelector) return;

			for (var i = 0; i < toggles.length; i++) {
				var toggle = toggles[i];

				// Append the Expandable details to the toggle element
				// so they are accessible later when the toggle is clicked
				toggle.expandable = {
					config: config,
					targetSelector: targetSelector
				};

				if (mode == "expand") {
					toggle.addEventListener("click", function(e) {
						var toggle = e.target;
						handleToggle(toggle, "expand");
					});
				} else if (mode == "collapse") {
					toggle.addEventListener("click", function(e) {
						var toggle = e.target;
						handleToggle(toggle, "collapse");
					});
				} else {
					toggle.addEventListener("click", function(e) {
						var toggle = e.target;
						handleToggle(toggle);
					});
				}
			}
		}

		function handleToggle(toggle, mode) {

			var targets = document.querySelectorAll(toggle.expandable.targetSelector);
			
			for (var i = 0; i < targets.length; i++) {
				var target = targets[i];
				if (mode == "expand") {
					window.Expandable.expand(target, config);
				} else if (mode == "collapse") {
					window.Expandable.collapse(target, config);
				} else {
					window.Expandable.toggle(target, config);
				}
			}
		}

		/**
		 * Toggles an element between expanded / collapsed states
		 * 
		 * @param {htmlElement} element 
		 * @param {configSettings} config (Optional) Configuration settings
		 */
		function toggle(element, config) {
			if (element.clientHeight == 0) {
				expand(element, config);
			} else {
				collapse(element, config);
			}
		}

		/**
		 * Smoothly collapses an element to its zero height
		 * 
		 * Allows CSS transitions to work smoothly (transitions don't work with height: auto)
		 * Applies a default transition speed if no height transition is specified on the element
		 * 
		 * @param {htmlElement} element 
		 * @param {configSettings} config (Optional) Configuration settings
		 */
		function collapse(element, config) {
			if (element.clientHeight == 0) {
				// Already collapsed
				return;
			}

			// Add an identifying class during the transition
			element.classList.add("collapsing");
			element.classList.remove("expanding");

			// get the height of the element's inner content, regardless of its actual size
			var sectionHeight = element.scrollHeight;
			
			// Set starting open height to make sure height is not transitioning from 'auto'
			element.style.height = sectionHeight + 'px';

			addTemporaryTransitionIfNecessary(element);

			// Set height to zero
			element.style.height = 0 + 'px'
			
			// when the next css transition finishes (which should be the one we just triggered)
			element.addEventListener('transitionend', function(e) {
				// remove this event listener so it only gets triggered once
				element.removeEventListener('transitionend', arguments.callee);
				element.classList.remove("collapsing");
				if (config && config.classOnExpanded) {
					// Remove the specified class and the manual height setting
					// Assumes the element's natural state without classToRemove is 0px height
					element.classList.remove(config.classOnExpanded);
					element.style.height = null;
				}
				if (config && config.classOnCollapsed) {
					element.classList.add(config.classOnCollapsed);
				}
				removeTemporaryTransitionIfNecessary(element);
			});
		}
			
		/**
		 * Smoothly expands an element to its auto height
		 * 
		 * Allows CSS transitions to work smoothly (transitions don't work with height: auto)
		 * Applies a default transition speed if no height transition is specified on the element
		 * 
		 * @param {htmlElement} element 
		 * @param {configSettings} config (Optional) Configuration settings
		 */
		function expand(element, config) {
			
			// Add an identifying class during the transition
			element.classList.add("expanding");
			element.classList.remove("collapsing");

			// get the height of the element's inner content, regardless of its actual size
			var sectionHeight = element.scrollHeight;

			addTemporaryTransitionIfNecessary(element);
			
			// have the element transition to the height of its inner content
			element.style.height = sectionHeight + 'px';

			// when the next css transition finishes (which should be the one we just triggered)
			element.addEventListener('transitionend', function(e) {
				// remove this event listener so it only gets triggered once
				element.removeEventListener('transitionend', arguments.callee);
				element.classList.remove("expanding");
				if (config && config.classOnExpanded) {
					// Add the specified class and remove the manual height setting
					// Assumes the element's classOnExpanded will handle applying auto height
					element.classList.add(config.classOnExpanded);
					element.style.height = null;
				} else {
					// Transition from fixed height to auto height
					element.style.height = "auto";
				}
				if (config && config.classOnCollapsed) {
					element.classList.remove(config.classOnCollapsed);
				}
				removeTemporaryTransitionIfNecessary(element);
			});
		}

		/**
		 * Add a temporary height transition if the element
		 * doesn't already have one specified
		 * 
		 * @param {htmlElement} element 
		 */
		function addTemporaryTransitionIfNecessary(element) {

			var elementStyle = getComputedStyle(element);

			if (elementStyle.transition.includes("height")) {
				return;
			}

			// Record the original inline transition style rule
			// so we can reset to it later
			element.style.originalTransition = element.style.transition;

			if (element.style.transition) {
				// Already has a different transition
				element.style.transition += ", height 300ms"
			} else {
				// No transition yet
				element.style.transition = "height 300ms"
			}
		}

		/**
		 * Remove the temporary height transition by resetting to
		 * the original inline transition style rule
		 * 
		 * @param {htmlElement} element 
		 */
		function removeTemporaryTransitionIfNecessary(element) {
			if (!element.style.hasOwnProperty("originalTransition")) {
				return;
			}

			element.style.transition = element.style.originalTransition;
			delete(element.style.originalTransition);
		}

		return {
			getNewConfig: getNewConfig,
			registerToggle: registerToggle,
			registerExpander: registerExpander,
			registerCollapser: registerCollapser,
			toggle: toggle,
			expand: expand,
			collapse: collapse
		}

	}

	window.Expandable = new Expandable();

} )();
