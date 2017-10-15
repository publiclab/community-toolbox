(function() {

  var org = getUrlHashParameter('o') || 'publiclab';
  var repo = getUrlHashParameter('r') || 'plots2';

  portrait = CommunityPortrait(org, repo);

})();
