function generateAutocomplete(repos) {
    let repoAlreadySelected = urlHash().getUrlHashParameters('r');
    if(jQuery.isEmptyObject(repoAlreadySelected)) { 
        repoAlreadySelected = "plots2";
    }else {
        repoAlreadySelected = repoAlreadySelected.r;
    }
    $('#dropdownMenuButton').html(repoAlreadySelected);

    repos.map((repo,i) => {
        $('<p>', {
            class: 'dropdown-items',
            text: repo
        }).appendTo('#dropdown-container');
    });
    
    $('.dropdown-items').click((e) => {
        let repo = e.target.textContent;
        urlHash().setUrlHashParameter("r", repo);
        $('#dropdownMenuButton').html(repo);
        location.reload();
    })
}



module.exports.generateAutocomplete = generateAutocomplete;