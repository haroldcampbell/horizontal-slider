/**
 * Created by: Harold Campbell
 * twitter: @haroldcampbell
 * version 0.0.2
 */
hslider = {
    __createSlider(knobElm, containerElm) {
        return {
            isEnabled: false,
            isInitialize: false,
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
            updateKnobPosition(containerEvent) {
                let w = this.container.elm.scrollWidth;
                let left = this.container.elm.style.left;
                let x = containerEvent.screenX - this.container.elm.offsetLeft;

                this.knob.position.x = x - this.knob.startOffset;

                if (x < this.knob.startOffset) {
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
        };
    },

    __initSlider(event, knobElm) {
        let containerElm = knobElm.parentNode;
        let slider = containerElm.slider;

        slider.knob.width = knobElm.scrollWidth
        slider.knob.startOffset = event.screenX - containerElm.offsetLeft;

        slider.container.width = containerElm.scrollWidth;
        slider.container.sliderWidth = containerElm.scrollWidth - knobElm.clientWidth;
        slider.isInitialize = true;

        document.onmouseup = function (event) {
            /** Used to disable the slider if the user did the mouseup
             * outside of the container.  */
            if (slider.isEnabled) {
                slider.isEnabled = false;
            }
        }
    },

    __setSliderStatus(event, knobElm, isEnabled) {
        let slider = knobElm.parentNode.slider;

        if (!slider.isInitialize) {
            this.__initSlider(event, knobElm);
        }

        slider.isEnabled = isEnabled;
    },

    knobEnable(event, knobElm) {
        this.__setSliderStatus(event, knobElm, true)
    },

    knobDisable(event, knobElm) {
        this.__setSliderStatus(event, knobElm, false)
    },

    updateKnobPosition(event, containerElm, labelId) {
        if (!containerElm.slider.isInitialize || !containerElm.slider.isEnabled) {
            return;
        }

        containerElm.slider.updateKnobPosition(event);

        let label = document.getElementById(labelId);
        if (label != null) {
            label.innerText = containerElm.slider.knob.range;
        }
    },

    /**
     * Disables the slider if the user does a mouseup
     * while inside the slider-container
     */
    sliderDisable(event, owner, labelId) {
        if (owner.slider === undefined || owner.slider === null) {
            return;
        }

        if (event.relatedTarget == owner.slider.knob.elm) {
            return;
        }

        this.updateKnobPosition(event, owner, labelId);
        owner.slider.isEnabled = false;
    },

    __textToHTMLNode(text) {
        let temp = document.createElement('div');
        temp.innerHTML = text;

        return temp.firstChild;
    },

    initializeSliders() {
        let sliders = document.getElementsByTagName("hslider");

        for (let index = 0; index < sliders.length; index++) {
            let elm = sliders[index];
            let knobElm = this.__textToHTMLNode('<div id="knob" class="slider-knob"></div>')

            knobElm.onmousedown = function (event) {
                hslider.knobEnable(event, knobElm);
            }
            knobElm.onmouseup = function (event) {
                hslider.knobDisable(event, knobElm);
            }

            let labelId = elm.getAttribute('labelid');
            let containerElm = this.__textToHTMLNode('<div class="slider-container"></div>');

            containerElm.onmouseout = function (event) {
                hslider.sliderDisable(event, containerElm, labelId);
            }
            containerElm.onmousemove = function (event) {
                hslider.updateKnobPosition(event, containerElm, labelId);
            }

            containerElm.appendChild(knobElm);
            elm.appendChild(containerElm);

            containerElm.slider = this.__createSlider(knobElm, containerElm)
        }
    },

    getSliderById(hsliderId) {
        let hsliderElm = document.getElementById(hsliderId);
        if(hsliderElm == null) {
            return null;
        }

        let sliderElm = hsliderElm.querySelectorAll(":scope .slider-container")[0];

        return sliderElm.slider;
    }
}