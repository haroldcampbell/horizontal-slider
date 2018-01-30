/**
 * Created by: Harold Campbell
 * twitter: @haroldcampbell
 * version 0.0.6
 */

hslider = {
    __activeSlider: null,
};

hslider.__createSlider = function (containerElm, knobElm, labelElm) {
    return {
        isEnabled: false,
        isInitialize: false,
        labelElm: labelElm,

        knob: {
            elm: knobElm,
            width: knobElm.scrollWidth,
            position: {
                x: 0,
                y: 0
            },
            range: 0,
            onRangeChanged: null,
            startOffset: 0,
        },

        container: {
            elm: containerElm,
            width: containerElm.scrollWidth,
            sliderWidth: containerElm.scrollWidth - knobElm.clientWidth,
        },

        updateKnobPosition(documentEvent) {
            let rect = this.container.elm.getBoundingClientRect();
            let left = documentEvent.clientX - rect.left;

            this.knob.position.x = left

            if (left < 0){
                this.knob.position.x = 0;
            } else if (this.knob.position.x + this.knob.width > this.container.width) {
                this.knob.position.x = this.container.sliderWidth;
            }

            this.knob.range = this.knob.position.x / this.container.sliderWidth;
            if (this.knob.onRangeChanged != null) {
                this.knob.onRangeChanged(this);
            }

            this.knob.elm.style.left = this.knob.position.x;
        },

        updateLabelText() {
            if (this.labelElm != null) {
                this.labelElm.innerText = this.knob.range;
            }
        },

        onmouseup(event) {
            if (!hslider.__hasActiveSlider()) {
                return;
            }

            if (hslider.__activeSlider.isEnabled) {
                hslider.__activeSlider.isEnabled = false;
            }
        },

        onmousemove(event) {
            if (!hslider.__hasActiveSlider() || !hslider.__isActive()) {
                return;
            }

            hslider.__activeSlider.updateKnobPosition(event);
            hslider.__activeSlider.updateLabelText();
        },
    };
}

hslider.__hasActiveSlider = function () {
    return (this.__activeSlider !== undefined && this.__activeSlider !== null);
}

hslider.__isActive = function () {
    return this.__activeSlider.isInitialize && hslider.__activeSlider.isEnabled
}

hslider.__initSlider = function (event, knobElm) {
    let containerElm = knobElm.parentNode;
    let slider = containerElm.slider;

    slider.knob.width = knobElm.scrollWidth
    slider.knob.startOffset = event.screenX - containerElm.offsetLeft;

    slider.container.width = containerElm.scrollWidth;
    slider.container.sliderWidth = containerElm.scrollWidth - knobElm.clientWidth;
    slider.isInitialize = true;
}

hslider.__setSliderStatus = function (event, knobElm, isEnabled) {
    document.onmouseup = null;
    document.onmousemove = null;

    let slider = knobElm.parentNode.slider;

    if (!slider.isInitialize) {
        this.__initSlider(event, knobElm);
    }

    slider.isEnabled = isEnabled;
    this.__activeSlider = slider;

    if (isEnabled) {
        document.onmouseup = slider.onmouseup;
        document.onmousemove = slider.onmousemove;
    }
}

hslider.__textToHTMLNode = function (text) {
    let temp = document.createElement('div');
    temp.innerHTML = text;

    return temp.firstChild;
}

hslider.knobEnable = function (event, knobElm) {
    this.__setSliderStatus(event, knobElm, true)
}

hslider.knobDisable = function (event, knobElm) {
    this.__setSliderStatus(event, knobElm, false)
}

hslider.initializeSliders = function () {
    let sliders = document.getElementsByTagName("hslider");

    for (let index = 0; index < sliders.length; index++) {
        let rootElm = sliders[index];
        let knobElm = this.__textToHTMLNode('<div id="knob" class="horizontal-slider-knob"></div>')

        knobElm.onmousedown = function (event) {
            hslider.knobEnable(event, knobElm);
        }
        knobElm.onmouseup = function (event) {
            hslider.knobDisable(event, knobElm);
        }

        let labelElm = null;
        let labelId = rootElm.getAttribute('labelid');
        let containerElm = this.__textToHTMLNode('<div class="horizontal-slider-container"></div>');

        if (labelId != null) {
            labelElm = document.getElementById(labelId);
        }

        containerElm.appendChild(knobElm);
        rootElm.appendChild(containerElm);

        containerElm.slider = this.__createSlider(containerElm, knobElm, labelElm)
    }
}

hslider.getSliderById = function (hsliderId) {
    let hsliderElm = document.getElementById(hsliderId);
    if (hsliderElm == null) {
        return null;
    }

    let sliderElm = hsliderElm.querySelectorAll(":scope .horizontal-slider-container")[0];

    return sliderElm.slider;
}

/**
 * Exports all attributes and methods.
 *
 * @method exportAll
 * @param {Object} _ex - the exports module that we will add the attributes
 * and methods to
 */
function exportAll(_ex) {
    for (var id in hslider) {
        try {
            _ex[id] = hslider[id]
        } catch (err) {
        }
    }
}

/* Check if we are using export modules. */
try {
if (exports !== undefined && exports != null) {
    exportAll(exports)
}
} catch(err) {}