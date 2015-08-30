(function (ch) {
    'use strict';

    var toggleEffects = {
        'slideDown': 'slideUp',
        'slideUp': 'slideDown',
        'fadeIn': 'fadeOut',
        'fadeOut': 'fadeIn'
    };

    /**
     * The Collapsible class gives to components the ability to shown or hidden its container.
     * @memberOf ch
     * @mixin
     * @returns {Function} Returns a private function.
     */
    function Collapsible() {

        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this,
            triggerClass = 'ch-' + this.name + '-trigger-on',
            fx = this._options.fx,
            useEffects = (ch.support.transition && fx !== 'none' && fx !== false),
            pt, pb;

        function showCallback(e) {
            if (useEffects) {
                tiny.classList(that.container).remove('ch-fx-' + fx);

                // TODO: Use original height when it is defined
                if (/^slide/.test(fx)) {
                    that.container.style.height = '';
                }
            }
            tiny.classList(that.container).remove('ch-hide');
            that.container.setAttribute('aria-hidden', 'false');

            if (e) {
                e.target.removeEventListener(e.type, showCallback);
            }

            /**
             * Event emitted when the component is shown.
             * @event ch.Collapsible#show
             * @example
             * // Subscribe to "show" event.
             * collapsible.on('show', function () {
             *     // Some code here!
             * });
             */
            that.emit('show');
        }

        function hideCallback(e) {
            if (useEffects) {
                tiny.classList(that.container).remove('ch-fx-' + toggleEffects[fx]);
                that.container.style.display = '';
                if (/^slide/.test(fx)) {
                    that.container.style.height = '';
                }
            }
            tiny.classList(that.container).add('ch-hide');
            that.container.setAttribute('aria-hidden', 'true');

            if (e) {
                e.target.removeEventListener(e.type, hideCallback);
            }

            /**
             * Event emitted when the component is hidden.
             * @event ch.Collapsible#hide
             * @example
             * // Subscribe to "hide" event.
             * collapsible.on('hide', function () {
             *     // Some code here!
             * });
             */
            that.emit('hide');
        }

        this._shown = false;

        /**
         * Shows the component container.
         * @function
         * @private
         */
        this._show = function () {

            that._shown = true;

            if (that.trigger !== undefined) {
                tiny.classList(that.trigger).add(triggerClass);
            }

            /**
             * Event emitted before the component is shown.
             * @event ch.Collapsible#beforeshow
             * @example
             * // Subscribe to "beforeshow" event.
             * collapsible.on('beforeshow', function () {
             *     // Some code here!
             * });
             */
            that.emit('beforeshow');

            // Animate or not
            if (useEffects) {
                var _h = 0;

                // Be sure to remove an opposite class that probably exist and
                // transitionend listener for an opposite transition, aka $.fn.stop(true, true)
                ch.Event.removeListener(that.container, ch.support.transition.end, hideCallback);
                tiny.classList(that.container).remove('ch-fx-' + toggleEffects[fx]);

                ch.Event.addListener(that.container, ch.support.transition.end, showCallback);

                // Reveal an element before the transition
                that.container.style.display = 'block';

                // Set margin and padding to 0 to prevent content jumping at the transition end
                if (/^slide/.test(fx)) {
                    // Cache the original paddings for the first time
                    if (!pt || !pb) {
                        pt = ch.util.getStyles(that.container, 'padding-top');
                        pb = ch.util.getStyles(that.container, 'padding-bottom');

                        that.container.style.marginTop = that.container.style.marginBottom =
                            that.container.style.paddingTop = that.container.style.paddingBottom ='0px';
                    }

                    that.container.style.opacity = '0.01';
                    _h = that.container.offsetHeight;
                    that.container.style.opacity = '';
                    that.container.style.height = '0px';
                }

                // Transition cannot be applied at the same time when changing the display property
                setTimeout(function() {
                    if (/^slide/.test(fx)) {
                        that.container.style.height = _h + 'px';
                    }
                    that.container.style.paddingTop = pt;
                    that.container.style.paddingBottom = pb;
                    tiny.classList(that.container).add('ch-fx-' + fx);
                }, 0);
            } else {
                showCallback();
            }

            that.emit('_show');

            return that;
        };

        /**
         * Hides the component container.
         * @function
         * @private
         */
        this._hide = function () {

            that._shown = false;

            if (that.trigger !== undefined) {
                tiny.classList(that.trigger).remove(triggerClass);
            }

            /**
             * Event emitted before the component is hidden.
             * @event ch.Collapsible#beforehide
             * @example
             * // Subscribe to "beforehide" event.
             * collapsible.on('beforehide', function () {
             *     // Some code here!
             * });
             */
            that.emit('beforehide');

            // Animate or not
            if (useEffects) {
                // Be sure to remove an opposite class that probably exist and
                // transitionend listener for an opposite transition, aka $.fn.stop(true, true)
                ch.Event.removeListener(that.container, ch.support.transition.end, showCallback);
                tiny.classList(that.container).remove('ch-fx-' + fx);

                ch.Event.addListener(that.container, ch.support.transition.end, hideCallback);
                // Set margin and padding to 0 to prevent content jumping at the transition end
                if (/^slide/.test(fx)) {
                    that.container.style.height = ch.util.getStyles(that.container, 'height');
                    // Uses nextTick to trigger the height change
                    setTimeout(function() {
                        that.container.style.height = '0px';
                        that.container.style.paddingTop = that.container.style.paddingBottom ='0px';
                        tiny.classList(that.container).add('ch-fx-' + toggleEffects[fx]);
                    }, 0);
                } else {
                    setTimeout(function() {
                        tiny.classList(that.container).add('ch-fx-' + toggleEffects[fx]);
                    }, 0);
                }
            } else {
                hideCallback();
            }

            return that;
        };

        /**
         * Shows or hides the component.
         * @function
         * @private
         */
        this._toggle = function () {

            if (that._shown) {
                that.hide();
            } else {
                that.show();
            }

            return that;
        };

        this.on('disable', this.hide);
    }

    ch.Collapsible = Collapsible;

}(this.ch));