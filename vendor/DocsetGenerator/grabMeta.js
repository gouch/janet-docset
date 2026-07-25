var metaTags = [];
var metaElements = document.getElementsByTagName('meta');
var refreshMetaIndex = -1;
var refreshUrl = null;

for(var i = 0; i < metaElements.length; ++i)
{
    var meta = metaElements[i];
    var metaDict = {};

    // Get all attributes
    var attributes = meta.attributes;
    for(var j = 0; j < attributes.length; ++j)
    {
        var attr = attributes[j];
        metaDict[attr.name] = attr.value;
    }

    // Check for meta refresh
    if(metaDict["http-equiv"]?.toLowerCase() === "refresh" && metaDict["content"])
    {
        var match = metaDict["content"].match(/^(\d+;\s*url=)(.+)$/i);
        if(match)
        {
            refreshMetaIndex = metaTags.length;
            refreshUrl = match[2].replace(/^['"]|['"]$/g, "");
        }
    }

    if(Object.keys(metaDict).length > 0)
    {
        metaTags.push(metaDict);
    }
}

if(refreshMetaIndex >= 0 && refreshUrl)
{
    return window.dash.handleHref({href: refreshUrl, tagName: "META_REFRESH"}).then(function(relativeUrl) {
        var match = metaTags[refreshMetaIndex]["content"].match(/^(\d+;\s*url=)(.+)$/i);
        if(match)
        {
            metaTags[refreshMetaIndex]["content"] = match[1] + relativeUrl;
        }
        return metaTags;
    });
}

return metaTags;
