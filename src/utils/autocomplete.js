function generateAutocomplete(repos) {
    let repoAlreadySelected = urlHash().getUrlHashParameter('r');
    
    // populates the current dropdown selected html
    if(jQuery.isEmptyObject(repoAlreadySelected)) {
        repoAlreadySelected = "plots2";
    }else {
        repoAlreadySelected = (repoAlreadySelected.r == undefined) ? repoAlreadySelected : repoAlreadySelected.r;
    }
    $('#dropdownMenuButton').html(repoAlreadySelected);


    // populates the dropdown list
    repos.map((repo,i) => {
        $('<p>', {
            class: 'dropdown-items',
            text: repo
        }).appendTo('#dropdown-container');
    });


    // click handler for dropdown items 
    $('.dropdown-items').click((e) => {
        let repo = e.target.textContent;
        urlHash().setUrlHashParameter("r", repo);
        $('#dropdownMenuButton').html(repo);
        location.reload();
    })
}



module.exports.generateAutocomplete = generateAutocomplete;
