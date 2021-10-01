function insertFtoIssueAuthor(issueSet) {
    let usernames=[];
    let avatars=[];
    for(let [key, value] of Object.entries(issueSet)) {
      usernames.push(`<a href="https://github.com/${value.user.login}">@${value.user.login}</a>`);
      avatars.push(`<a href="https://github.com/${value.user.login}" title="${value.user.login}"><img width="100px" src="${value.user.avatar_url}"></a>`);
    }
    $('.fto-authors > .usernames').html(usernames.join(', '));
    $('.fto-authors > .avatars').html(avatars.join(' '));
  }


module.exports = {
    insertFtoIssueAuthor: insertFtoIssueAuthor
}