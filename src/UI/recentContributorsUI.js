
var insertRecentContributorsExec = false;
let filterUniqueUtil = require('../utils/filterUniqueContribs')


function insertRecentContributors(AllContributors){
    let usernames, avatars;
    let recentContributors = 0;

    if(AllContributors instanceof Map) {
      AllContributors = [ ...AllContributors.entries() ];

      usernames = AllContributors.map((userArray, i) => {
        return `<a href="https://github.com/${userArray[0]}">@${userArray[0]}</a>`;
      })
      avatars = AllContributors.map((userArray, i) => {
        return `<a href="https://github.com/${userArray[0]}" title="${userArray[0]}"><img width="100px" src="https://avatars.githubusercontent.com/${userArray[0]}"></a>`;
      })
    }
    else {
      // Removes duplicate data in the recent contributors list
      AllContributors = filterUniqueUtil.filterUniqueContribs(AllContributors);

      usernames = AllContributors.map((commit, i) => {
        return `<a href="${commit.author.html_url}">@${commit.author.login}</a>`;
      })
      avatars = AllContributors.map((commit, i) => {
        return `<a href="${commit.author.html_url}" class="hvr-Glow"><img width="100px" src="${commit.author.avatar_url}"></a>`;
      })
    }
  
    recentContributors += AllContributors.length;
  
    if(insertRecentContributorsExec) $('.recent-contributors > .usernames').append(', ');
    $('.recent-contributors-head').html('Recent Contributors ('+recentContributors+'+)');
    $('.recent-contributors-body > .recent-contrib-content-box > .usernames').html(usernames.join(', '));
    $('.recent-contributors-body > .recent-contrib-content-box > .avatars').html(avatars.join(''));
    insertRecentContributorsExec=true;
  }
  

module.exports = {
  insertRecentContributors: insertRecentContributors,
};