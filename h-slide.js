function __initSlider(event, owner) {
    slider = {
        knob: owner,
        container: owner.parentNode,
        isEnabled: false,
        knobWidth: owner.scrollWidth,
        containerWidth: owner.parentNode.scrollWidth,
        startOffset: (event.screenX - owner.parentNode.offsetLeft),
        sliderWidth: owner.parentNode.scrollWidth - owner.clientWidth,
        knobPosition: {
            x: 0,
            y: 0
        }
    };
    owner.parentNode.slider = slider;
    document.onmouseup = function (event) {
        /** Used to disable the slider if the user did the mouseup
         * outside of the container.  */
        if (slider.isEnabled) {
            slider.isEnabled = false;
        }
    }
    return slider;
}

function __setSliderStatus(event, owner, isEnabled) {
    let slider = owner.parentNode.slider;

    if (slider === undefined || slider === null) {
        slider = __initSlider(event, owner);
    }

    slider.isEnabled = isEnabled;
}

function knobEnable(event, owner) {
    __setSliderStatus(event, owner, true)
}

function knobDisable(event, owner) {
    __setSliderStatus(event, owner, false)
}

function updateKnobPosition(event, owner, labelId) {
    if (owner.slider === undefined || owner.slider === null || !owner.slider.isEnabled) {
        return;
    }

    let w = owner.scrollWidth;
    let left = owner.style.left;
    let x = event.screenX - owner.offsetLeft;

    let sliderNode = owner.querySelectorAll(":scope .slider-knob")[0];
    owner.slider.knobPosition.x = x - owner.slider.startOffset;

    if (x < owner.slider.startOffset) {
        owner.slider.knobPosition.x = 0;
    } else if (owner.slider.knobPosition.x + owner.slider.knobWidth > owner.slider.containerWidth) {
        owner.slider.knobPosition.x = owner.slider.sliderWidth;
    }
    sliderNode.style.left = owner.slider.knobPosition.x;

    let label = document.getElementById(labelId);
    if(label === null) {
        return;
    }
    label.innerText = owner.slider.knobPosition.x / owner.slider.sliderWidth;
}

/**
 * Disables the slider if the user does a mouseup
 * while inside the slider-container
 */
function sliderDisable(event, owner, labelId) {
    if (owner.slider === undefined || owner.slider === null) {
        return;
    }

    if (event.relatedTarget == owner.slider.knob) {
        return;
    }

    updateKnobPosition(event, owner, labelId);
    owner.slider.isEnabled = false;
}