// ajax open prototype
var ajax_open_original = XMLHttpRequest.prototype.open;
// cached rules
var cacheRules = [];

/**
 * intercept response of XMLHttpRequest
 * 
 * @param {object} rules rules to intercept response
 * @param {string} rules.method  get/post/put/delete/patch
 * @param {string|RegExp} rules.pattern  regexp or string
 * @param {Function} rules.callback  
 */
function intercept_ajax (rules) {
    cacheRules = cacheRules.concat(rules);
    XMLHttpRequest.prototype.open = function() {
        var open_arguments = arguments;
        var method = open_arguments[0].toLowerCase(),
            url = open_arguments[1];

        // intercept or not
        var flag = false;
        var callback = function () {}; 
        for(let i = 0, len = cacheRules.length; i < len; i++) {
            var curRule = cacheRules[i];
            if ((curRule.method ? curRule.method === method : true) 
                && curRule.pattern instanceof RegExp ? curRule.pattern.test(url) : curRule.pattern === url) {
                flag = true;
                callback = curRule.callback;
                break;
            }
        }

        this.addEventListener('readystatechange', function(event) {
            if (flag && this.readyState === 4) {
                console.log('[ajax-intercept]', method, url);
                var response = callback(event.target.responseText);
                console.log('[ajax-intercept] response original', event.target.responseText, ', intercept result', response);
                Object.defineProperty(this, 'response', { writable: true });
                Object.defineProperty(this, 'responseText', { writable: true });
                this.response = this.responseText = response;
            }
        });

        return ajax_open_original.apply(this, open_arguments);
    };
};

window.intercept_ajax = intercept_ajax;