var scriptElements = document.body.getElementsByTagName('script');
for(var i = scriptElements.length-1; i >= 0; i--)
{
    scriptElements[i].parentElement.removeChild(scriptElements[i]);
}

function replaceWithDummy(element)
{
    var dummy = document.createElement(element.tagName+"_dash_dummy_tag");

    while(element.firstChild) {
        dummy.appendChild(element.firstChild);
    }

    for(index = element.attributes.length - 1; index >= 0; --index) {
        dummy.attributes.setNamedItem(element.attributes[index].cloneNode());
    }
    element.parentNode.replaceChild(dummy, element);
    return dummy;
}

var elementsToProcess = [];

window.dash.walkTheDOM(document.body, function(element) {
    if(element instanceof HTMLElement)
    {
        if(element.hasAttribute("srcset"))
        {
            element.removeAttribute("srcset");
        }
        if(element.hasAttribute("src") && !window.dash.stringHasPrefix(element.getAttribute("src"), "#"))
        {
            elementsToProcess.push({
                element: element,
                href: element.getAttribute("src"),
                tagName: element.tagName,
                attribute: "src"
            });
        }
        else if(element.hasAttribute("href") && !window.dash.stringHasPrefix(element.getAttribute("href"), "#"))
        {
            elementsToProcess.push({
                element: element,
                href: element.getAttribute("href"),
                tagName: element.tagName,
                attribute: "href"
            });
        }
    }
});

if(elementsToProcess.length > 0)
{
    var batch = elementsToProcess.map(function(item) {
        return {href: item.href, tagName: item.tagName};
    });

    window.dash.handleHrefBatch(batch).then(function(results) {
        for(var i = 0; i < elementsToProcess.length; ++i)
        {
            var item = elementsToProcess[i];
            var dummy = replaceWithDummy(item.element);
            dummy.setAttribute(item.attribute, results[i]);
        }
    });
}
