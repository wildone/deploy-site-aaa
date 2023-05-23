/* clientlib source: /apps/typerefinery/clientlibs/vendor/highlighter/script.js */
/*

highlight v5

Highlights arbitrary terms.

<http://johannburkard.de/blog/programming/javascript/highlight-javascript-text-higlighting-jquery-plugin.html>

MIT license.

Johann Burkard
<http://johannburkard.de>
<mailto:jb@eaio.com>

*/

jQuery.fn.highlight = function (pat) {
    function innerHighlight(node, pat) {
        var skip = 0;
        if (node.nodeType == 3) {
            var pos = node.data.toUpperCase().indexOf(pat);
            pos -= (node.data.substr(0, pos).toUpperCase().length - node.data.substr(0, pos).length);
            if (pos >= 0) {
                var spannode = document.createElement('span');
                spannode.className = 'highlight';
                var middlebit = node.splitText(pos);
                var endbit = middlebit.splitText(pat.length);
                var middleclone = middlebit.cloneNode(true);
                spannode.appendChild(middleclone);
                middlebit.parentNode.replaceChild(spannode, middlebit);
                skip = 1;
            }
        }
        else if (node.nodeType == 1 && node.childNodes && !/(script|style)/i.test(node.tagName)) {
            for (var i = 0; i < node.childNodes.length; ++i) {
                i += innerHighlight(node.childNodes[i], pat);
            }
        }
        return skip;
    }
    return this.length && pat && pat.length ? this.each(function () {
        innerHighlight(this, pat.toUpperCase());
    }) : this;
};

jQuery.fn.removeHighlight = function () {
    return this.find("span.highlight").each(function () {
        this.parentNode.firstChild.nodeName;
        with (this.parentNode) {
            replaceChild(this.firstChild, this);
            normalize();
        }
    }).end();
};
/* clientlib source: /apps/typerefinery/components/widgets/search/clientlibs/functions.js */
window.Typerefinery = window.Typerefinery || {};
window.Typerefinery.Components = Typerefinery.Components || {};
window.Typerefinery.Components.Widgets = Typerefinery.Components.Widgets || {};
window.Typerefinery.Components.Widgets.Search = Typerefinery.Components.Widgets.Search || {};
window.Typerefinery.Page = Typerefinery.Page|| {};
window.Typerefinery.Page.Events = Typerefinery.Page.Events || {};

; (function (ns, componentNs, eventNs, document, window) {
    "use strict";

    ns.debounce = (fn, delay) => {
        let timerId;
        return function (...args) {
            if (timerId) {
                clearTimeout(timerId);
            }
            timerId = setTimeout(() => {
                fn.apply(this, args);
                timerId = null;
            }, delay);
        };
    };

    ns.highlightWholePage = (componentConfig) => {

        // the value of the input to be searched.
        const valueToBeSearched = document.getElementById(componentConfig.id).value;

        // remove the highlight from the whole page.
        $('body').removeHighlight();

        // highlight the whole page.
        $('body').highlight(valueToBeSearched);
    };

    ns.eventOnHighlight = ($component, data) => {
        if (!$component) {
            return;
        };

        $($component).removeHighlight();

        $($component).highlight(data.value);
    };

    ns.init = ($component) => {
        const componentConfig = componentNs.getComponentConfig($component);

        const topic = componentConfig.topic;

        if(topic === "#PAGE" || !topic) {
            $component.addEventListener("input", ns.debounce(() => ns.highlightWholePage(componentConfig), 500));
            return;
        }

        $component.addEventListener("input", ns.debounce(() => eventNs.emitEvent(topic, { value: document.getElementById(componentConfig.id).value }), 500));
       
    };
})(Typerefinery.Components.Widgets.Search, Typerefinery.Components, Typerefinery.Page.Events, document, window);

/* clientlib source: /apps/typerefinery/components/widgets/search/clientlibs/behaviour.js */
window.Typerefinery = window.Typerefinery || {};
window.Typerefinery.Components = Typerefinery.Components || {};
window.Typerefinery.Components.Widgets = Typerefinery.Components.Widgets || {};
window.Typerefinery.Components.Widgets.Search = Typerefinery.Components.Widgets.Search || {};

;(function (ns, document) {
    "use strict";
    $(document).ready(function () {
        $("[component='search']").each(function() {
            ns.init(this);
        });
    });
})(window.Typerefinery.Components.Widgets.Search, document);

