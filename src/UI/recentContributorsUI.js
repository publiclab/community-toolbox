var insertRecentContributorsExec = false;


function insertRecentContributors(AllContributors){
    let recentContributors = 0;
    let usernames = AllContributors.map((commit, i) => {
      return `<a href="${commit.author.html_url}">@${commit.author.login}</a>`;
    })
    let avatars = AllContributors.map((commit, i) => {
      return `<a href="${commit.author.html_url}" class="hvr-Glow"><img width="100px" src="${commit.author.avatar_url}"></a>`;
    })
    recentContributors += AllContributors.length;
  
    if(insertRecentContributorsExec) $('.recent-contributors > .usernames').append(', ');
    $('.recent-contributors-head').html('Recent Contributors ('+recentContributors+'+)');
    $('.recent-contributors > .usernames').html(usernames.join(', '));
    $('.recent-contributors > .avatars').html(avatars.join(''));
    insertRecentContributorsExec=true;
  }
  

module.exports = {
  insertRecentContributors: insertRecentContributors,
};