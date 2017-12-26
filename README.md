# horizontal-slider

Simple slider written in ES6. There are no dependencies on external libraries.

# Theming

See the h-slide.css for examples on how to style the slider.

# Usage

First add the <strong>h-slide.css</strong> style.
```javascript
<link href="h-slide.css" media="all" rel="stylesheet" />
```

Then add the slider
```javascript
<hslider labelId='slider-text'></hslider>
<div id="slider-text">Drag the knob.</div>
```

Add the <strong>h-slide.js</strong> script

```javascript
<script src="./h-slide.js" type="text/javascript"></script>
```

Then finally wire the slider by calling <strong>hslider.initializeSliders()</strong>

```javascript
<script>
    hslider.initializeSliders();
</script>
```