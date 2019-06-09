function generateAutocomplete(repos) {
    $("#tags").autocomplete({
        source: repos,
        select: function (event, ui) {
            event.target.value = ui.item;

            urlHash().setUrlHashParameter("r", ui.item.value);
            location.reload();
        }
    });    
}


module.exports.generateAutocomplete = generateAutocomplete;