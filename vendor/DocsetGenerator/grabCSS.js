var styleSheets = [];
for(var i = 0; i < document.styleSheets.length; i++)
{
    var styleSheet = document.styleSheets[i];
    var cssDict = {};
    var cssContent = "";
    if(styleSheet.constructor === CSSStyleSheet)
    {
        var didAddMediaText = false;
        if(styleSheet.media && styleSheet.media.mediaText)
        {
            cssContent += "\n@media "+styleSheet.media.mediaText+" {";
            didAddMediaText = true;
        }
        try {
            for(var j = 0; j < styleSheet.cssRules.length; j++)
            {
                var rule = styleSheet.cssRules[j];
                if(rule.cssText.length)
                {
                    cssContent += "\n"+rule.cssText;
                }
            }
        }
        catch(error) {
            
        }
        if(didAddMediaText)
        {
            cssContent += "\n}\n";
        }
    }
    if(styleSheet.href && styleSheet.href.length)
    {
        var didAddMediaText = false;
        if(styleSheet.media && styleSheet.media.mediaText)
        {
            cssContent += "\n@media "+styleSheet.media.mediaText+" {";
            didAddMediaText = true;
        }
        cssContent += "\n\n@import url(\""+styleSheet.href+"\");";
        cssDict["href"] = styleSheet.href;
        if(didAddMediaText)
        {
            cssContent += "\n}\n";
        }
    }
    cssDict["content"] = cssContent;
    styleSheets.push(cssDict);
}

return styleSheets;
