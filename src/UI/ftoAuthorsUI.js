function insertFtoIssueAuthor (issueSet) {
  const avatars = [];
  for (const [value] of Object.entries(issueSet)) {
    avatars.push(
      `<a href="https://github.com/${value.user.login}" title="${value.user.login}"><img width="100px" src="${value.user.avatar_url}"></a>`
    );
  }
  $('.fto-authors').append(avatars.join(' '));
}

module.exports = {
  insertFtoIssueAuthor: insertFtoIssueAuthor
};
