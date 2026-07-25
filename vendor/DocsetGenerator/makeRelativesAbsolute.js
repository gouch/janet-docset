window.dash.walkTheDOM(document, function(element) {
    if(element instanceof HTMLElement)
    {
        if(element.hasAttribute("src") && !window.dash.stringHasPrefix(element.getAttribute("src"), "#"))
        {
            element.setAttribute("src", window.dash.getAbsoluteUrl(element.src));
        }
        else if(element.hasAttribute("href") && !window.dash.stringHasPrefix(element.getAttribute("href"), "#"))
        {
            element.setAttribute("href", element.href);
        }
        else if(element.tagName === "META" && element.getAttribute("http-equiv")?.toLowerCase() === "refresh")
        {
            var content = element.getAttribute("content");
            if(content)
            {
                var match = content.match(/^(\d+;\s*url=)(.+)$/i);
                if(match)
                {
                    var prefix = match[1];
                    var url = match[2].replace(/^['"]|['"]$/g, "");
                    var absoluteUrl = new URL(url, window.location.href).href;
                    element.setAttribute("content", prefix + absoluteUrl);
                }
            }
        }
        if(element.hasAttribute("integrity"))
        {
            element.removeAttribute("integrity");
        }
        if(element.hasAttribute("crossorigin"))
        {
            element.removeAttribute("crossorigin");
        }
    }
});
