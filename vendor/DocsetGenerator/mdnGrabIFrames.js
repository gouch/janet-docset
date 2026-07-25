var iframeSrcs = [];
var liveSamples = document.querySelectorAll('mdn-live-sample-result');

// Recursively search through shadow DOM for iframe
function findIframeInShadow(element)
{
    // Check direct children first
    var iframe = element.querySelector('iframe');
    if(iframe) return iframe;

    // Check shadow roots
    if(element.shadowRoot)
    {
        var shadowIframe = findIframeInShadow(element.shadowRoot);
        if(shadowIframe) return shadowIframe;
    }
    var children = element.querySelectorAll('*');
    for(var j = 0; j < children.length; j++)
    {
        if(children[j].shadowRoot)
        {
            var shadowIframe = findIframeInShadow(children[j].shadowRoot);
            if(shadowIframe) return shadowIframe;
        }
    }
    return null;
}

for(var i = 0; i < liveSamples.length; i++)
{
    var iframe = findIframeInShadow(liveSamples[i]);
    if(iframe && iframe.src)
    {
        iframeSrcs.push(iframe.src);
    }
    else
    {
        iframeSrcs.push(null);
    }
}

return JSON.stringify(iframeSrcs);
