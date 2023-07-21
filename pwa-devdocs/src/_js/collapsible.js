/*
 * A collapsible widget used in the left TOC 
 */

define("collapsible",
    ["jquery/dist/jquery"],
    function(jquery) {

        let hide = (control, target, speed) => {
            jquery(control).html("arrow_drop_down");
            jquery(target).slideUp(speed);
        }

        let show = (control, target, speed) => {
            jquery(control).html("arrow_drop_up");
            jquery(target).slideDown(speed);

        } 

        let toggle = (control, target, speed) => {
            if(jquery(control).html() === "arrow_drop_down") {
                show(control,target, speed);
            }
            else {
                hide(control,target, speed);
            }
        }

        let Collapsible = {

            /**
             * Applies the collapsible functionality
             * @control {DOM} The DOM element that controls the hide/show.
             *                  This element needs to have a material.io icon tag (<i>).
             * @target {DOM} The DOM element to hide/show 
             * @speed {int} The speed of the show/hide functionality
             */
            apply: function(control, target, speed=200) {
                jquery(control).click(function(){
                    toggle(jquery(control).children('i'), target,speed);
                })
            },

            /**
             * Toggles the collapsible functionality
             */
            toggle: toggle

        }

        return Collapsible;

    }
);