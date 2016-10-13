/**
 * Provides a default map for event.key in keyboard events
 */
(function (global) {
    "use strict";
    var defMap = {
            13: 'Enter',
            27: 'Escape',

            33: 'PageUp',
            34: 'PageDown',

            37: 'ArrowLeft',
            38: 'ArrowUp',
            39: 'ArrowRight',
            40: 'ArrowDown',
        },

        // Other printable characters
        fcc = [ 32 ],

        keyManager = global.keyManager = Object.create(Object, {
            map: {
                get: function () { return map; },
                set: function (o) { map = o; }
            }
        }),

        prop = { get: function () {
                    var code = this.which;

                    return map[code] || 'Unidentified';
               }},

        map = Object.create(defMap);

    // Numpad
    for (var i = 0; i <= 9; i++)
        defMap[i + 96] = String(i);

    // F keys
    for (var i = 1; i < 25; i++)
        defMap[i + 111] = 'F' + i;

    // Printable characters
    for (var i = 48; i < 91; i++)
        defMap[i] = String.fromCharCode(i);

    if (global.KeyboardEvent)
        Object.defineProperty(global.KeyboardEvent.prototype, 'key', prop);

    if (global.KeyEvent)
        Object.defineProperty(global.KeyEvent.prototype, 'key', prop);

})(window);
