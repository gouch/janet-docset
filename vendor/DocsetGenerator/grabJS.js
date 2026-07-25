function scriptDictForScript(script, isHead) {
    var scriptDict = {};
    var scriptContent = script.innerText;
    if(script.src && script.src.length)
    {
        scriptDict["src"] = script.src;
    }
    if(scriptContent && scriptContent.length)
    {
        scriptDict["content"] = scriptContent;
    }
    if(script.type && script.type.length)
    {
        scriptDict["type"] = script.getAttribute("type");
    }
    if(isHead)
    {
        scriptDict["location"] = "head";
    }
    return scriptDict;
}

var scripts = [];
var scriptElements = document.getElementsByTagName('script');
for(var i = 0; i < scriptElements.length; i++)
{
    var script = scriptElements[i];
    scripts.push(scriptDictForScript(script, false));
}

return scripts;
