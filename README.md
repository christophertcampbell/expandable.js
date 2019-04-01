# Expandable.js

Copyright (c) 2019 [Chris Campbell](https://github.com/christophertcampbell); License: MIT

## About

A lightweight Javascript package providing expandable / collapsable behavior for HTML elements.

Allows use of CSS "transition: height" when expanding to / collapsing from auto height, which doesn't normally use the CSS "height" transition property.

## How it Works

Expandable.js works by having toggles elements registered, along with the targets they they should expand/collapse.

Expandable.js methods can be passed an optional `config` object to customize their behavior (add custom class names upon expand/collapse, etc);

## How to Use

### 1. Include the Expandable.js distributable in your project

`expandable.js` can be found in the `/dist/` directory of this repository.

```javascript
<script type="text/javascript" src="path/expandable.js"></script>
```

### 2. Register toggles and their targets, or trigger action directly

```javascript
// Register toggle elements and the target elements they should collapse/expand when the toggle is clicked
Expandable.registerToggle(toggleSelector, targetSelector, config); // Expands or collapses
Expandable.registerExpander(toggleSelector, targetSelector, config); // Expands only
Expandable.registerCollapser(toggleSelector, targetSelector, config); // Collapses only

// Direct usage, takes action immediately without registering event listeners
Expandable.toggle(targetSelector, config); // Expands or collapses
Expandable.expand(targetSelector, config); // Expands only
Expandable.collapse(targetSelector, config); // Collapses only

// Get a new configuration object, ready to customize and pass to Expandable.js methods
// This is a convenience method; you can also create a config object manually (see below)
Expandable.getNewConfig();

// Example config object
var config = {
	classOnExpanded: "my-expanded-class",
	classOnCollapsed: "my-collapsed-class"
}

```

* toggleSelector can be any valid CSS selector
* targetSelector can be any valid CSS selector
* Toggle and target selectors may resolve to single or multiple html elements
* config is optional; can be passed to customize the expand/collapse behavior

#### Example 1 - Basic Toggle

```javascript
	// Clicking the element(s) with id #myToggleSelector will toggle expanded/collapsed
	// state for the element(s) with class .myTargetSelector
	Expandable.registerToggle("#myToggleSelector", ".myTargetSelector");
```

#### Example 2 - Basic Toggle, With Config

```javascript
	// In this example, a config object is passed for customizing the behavior
	var config = {
		classOnExpanded: "my-expanded-class",
		classOnCollapsed: "my-collapsed-class"
	}
	Expandable.registerToggle("#myToggleSelector", ".myTargetSelector", config);
```



## License

Expandable.js is licensed under the MIT license (http://opensource.org/licenses/MIT)

## GitHub Repo

https://github.com/christophertcampbell/expandable.js