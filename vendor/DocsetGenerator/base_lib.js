window.dash = new Proxy({},
        { get : function(target, prop)
            {
                if(target[prop] === undefined)
                {
                    return function()  {
                        var selector = prop;
                        try {
                          return window.webkit.messageHandlers.dash.postMessage({"selector": selector, "arg": arguments[0]});
                        }
                        catch(err) {
                          return window.webkit.messageHandlers.dash.postMessage({"selector": selector});
                        }
                    };
                }
                else
                {
                    return target[prop];
                }
            }
});

window.dash.walkTheDOM = function(node, func)
{
    var result = func(node);
    if(result)
    {
        return result;
    }
    if(node && node instanceof HTMLTemplateElement)
    {
        node = node.content.firstChild;
    }
    else
    {
        node = node.firstChild;
    }
    while(node)
    {
        var result = window.dash.walkTheDOM(node, func);
        if(result)
        {
            return result;
        }
        node = node.nextSibling;
    }
    return null;
}

window.dash.getAnchor = function(hash, escapedHash)
{
    var anchor = document.getElementById(hash);
    anchor = (anchor) ? anchor : document.getElementById(escapedHash);
    anchor = (anchor) ? anchor : document.anchors.namedItem(hash);
    anchor = (anchor) ? anchor : document.anchors.namedItem(escapedHash);
    return anchor;
}

window.dash.substringFromString = function(string, fromString)
{
    var pos = string.toLowerCase().indexOf(fromString.toLowerCase());
    if(pos != -1)
    {
        return string.substring(pos+fromString.length, string.length);
    }
    return null;
}

window.dash.substringToString = function(string, toString)
{
    var pos = string.toLowerCase().indexOf(toString.toLowerCase());
    if(pos != -1)
    {
        return string.substring(0, pos);
    }
    return null;
}

window.dash.stringHasPrefix = function(string, prefix)
{
    return string.startsWith(prefix);
}

window.dash.isCaseInsensitiveEqual = function(a, b)
{
    return typeof a === 'string' && typeof b === 'string'
        ? a.localeCompare(b, undefined, { sensitivity: 'accent' }) === 0
        : a === b;
}

window.dash.getAbsoluteUrl = (function() {
    var a;

    return function(url) {
        if(!a) a = document.createElement('a');
        a.href = url;

        return a.href;
    };
})();
