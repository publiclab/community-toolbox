var moment = require('moment');

function generateIssueHtml(title, body, githubUrl, repo) {
  var repoName = githubUrl.split('/')[4],
      repoUrl = githubUrl.split('/').slice(0, 5).join('/'),
      html = '<div class="panel panel-default">\
    <div class="panel-heading">\
      <h3 class="panel-title" style="float:right;font-size:12px;"><b><a href="' + repoUrl + '">' + repoName + '</a></b></h3>\
      <h3 class="panel-title"><b><a href="' + githubUrl + '">' + title + '</a></b></h3>\
    </div>\
    <div class="panel-body">\
      ' + body + '\
    </div>\
  </div>';
  return html;
}

function insertIssue(issue, el) {
  var body = "";
  body += "<div style='float:right;' class='labels'>"
  issue.labels.forEach(function(label) {
    body += "<a class='label label-default' href='" + label.url + "' style='background:#" + label.color + ";'>" + label.name + "</a> ";
  });
  body += "</div>";
  body += "<b>#" + issue.number + "</b> opened " + moment(issue.updated_at).fromNow() + " ";
  body += "by <a href='https://github.com/" + issue.user.login + "'>" + issue.user.login + "</a>";
  body += " <i class='fa fa-comment-o'></i> " + issue.comments;
  $(el).append(generateIssueHtml(issue.title, body, issue.html_url, issue));
}

//Check if function executed so we can add a comma
var insertContributorsExec = false;
var insertRecentContributorsExec = false;

function insertContributors(AllContributors){
  // This removes the spinner icon as soon as contributors list is loaded
  document.getElementById("spinner-icon").style.display = "none";

  let totalContributors = 0;
  var user = AllContributors.map(function getContributorUsername(c) {
    return `<div class=" col-xs-12 col-sm-4 col-md-3 col-lg-2 text-center">
              <div class="card">
                <img width="100px" src="${c.avatar_url}">
                <div class="card-body">
                  <h4 class="card-title">@${c.login}</h4>
                </div>
              </div>
            </div>`;
  });

  totalContributors += AllContributors.length;
  if(insertContributorsExec) $('.contributors > .usernames').append(', ');
  $('.contributors-head').html('Contributors ('+totalContributors+'+)');
  $('.contributors > .user').append(user.join(' '));
  insertContributorsExec=true;
}

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
  generateIssueHtml: generateIssueHtml,
  insertIssue: insertIssue,
  insertContributors: insertContributors,
  insertRecentContributors: insertRecentContributors,
};
