function populateNavDropdown (repos) {
  // eslint-disable-next-line no-undef
  let repoAlreadySelected = urlHash().getUrlHashParameter('r');

  // populates the current dropdown selected html
  if (jQuery.isEmptyObject(repoAlreadySelected)) {
    repoAlreadySelected = 'plots2';
  } else {
    repoAlreadySelected =
      repoAlreadySelected.r === undefined
        ? repoAlreadySelected
        : repoAlreadySelected.r;
  }
  $('#dropdownMenuButton').html(repoAlreadySelected);

  // populates the dropdown list
  repos.map((repo, i) => {
    $('<p>', {
      class: 'dropdown-items',
      text: repo
    }).appendTo('#dropdown-container');
  });

  // click handler for dropdown items
  $('.dropdown-items').click(e => {
    const repo = e.target.textContent;
    // eslint-disable-next-line no-undef
    urlHash().setUrlHashParameter('r', repo);
    $('#dropdownMenuButton').html(repo);
    // eslint-disable-next-line no-undef
    location.reload();
  });
}

module.exports.populateNavDropdown = populateNavDropdown;
