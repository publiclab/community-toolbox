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
  body += "<b>#" + issue.number + "</b> opened " + moment(issue.updated_at).fromNow() + " ago ";
  body += "by <a href='https://github.com/" + issue.user.login + "'>" + issue.user.login + "</a>";
  body += " <i class='fa fa-comment-o'></i> " + issue.comments;
  $(el).append(generateIssueHtml(issue.title, body, issue.html_url, issue));
}

module.exports = {
  generateIssueHtml: generateIssueHtml,
  insertIssue: insertIssue
};
