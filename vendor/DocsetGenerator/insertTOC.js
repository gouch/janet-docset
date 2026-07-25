var failedEntries = [];

for(const entry of toc)
{
    const name = entry["name"];
    const anchor = entry["anchor"];
    const type = entry["type"];
    const hash = entry["hash"];
    const escapedHash = entry["escapedHash"];
    var element = document.getElementById(hash);
    element = (element) ? element : document.getElementById(escapedHash);
    element = (element) ? element : document.elements.namedItem(hash);
    element = (element) ? element : document.elements.namedItem(escapedHash);

    if(!element)
    {
        failedEntries.push({"name": name, "hash": hash});
    }
    else
    {
        const dashAnchor = document.createElement("a");
        dashAnchor.name = anchor;
        dashAnchor.className = "dashAnchor";
        element.parentElement.insertBefore(dashAnchor, element);
    }
}

return failedEntries;
