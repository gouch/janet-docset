const pageTitle = $("title").text();
dashDoc.addEntry({name: pageTitle, type: "Guide"});

$("h1").each(function() {
    const entryName = $(this).text();
    var entryHash = $(this).attr('id');
    if(!entryHash)
    {
        entryHash = entryName.replace(/\W/g, '');
        $(this).attr('id', entryHash);
    }
    dashDoc.addEntry({name: entryName, type: "Section", hash: entryHash});
});

