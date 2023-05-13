/* eslint-disable semi */
/* eslint-disable no-undef */
document.addEventListener('DOMContentLoaded', function () {
  /* Navbar scroll to that perticular section of page */
  $('.navbar a').on('click', function (e) {
    if (this.hash !== '') {
      e.preventDefault();

      const hash = this.hash;
      $('html,body').animate({
        scrollTop: $(hash).offset().top
      }, 800);
    }
  });

  /* language section */
  var request = new XMLHttpRequest()

  request.open('GET', 'https://api.github.com/users/publiclab/repos', true);

  request.onload = function () {
    var data = JSON.parse(this.response);
    var statusHTML = '';
    $.each(data, function (i, status) {
      statusHTML += '<div class="conatiner-language">';
      statusHTML += '<div class="repo-name"><a href="' + status.html_url + '">' + status.name + '</a></div>';
      if (status.language == null) {
        statusHTML += '<span class="badge">' + 'N/A' + '</span>';
      } else {
        statusHTML += '<span class="badge">' + status.language + '</span>';
      }
      statusHTML += '</div>';
    });
    $('#tbody').html(statusHTML);
  }

  request.send();

  /* langauge section ends */

  /* Scroll to top when arrow up clicked BEGIN */
  $(window).scroll(function () {
    // Setting for back to top button
    const height = $(window).scrollTop();
    if (height > 100) {
      $('#back2Top').fadeIn();
    } else {
      $('#back2Top').fadeOut();
    }
  });
});

// EVENT LISTENERS FOR FILTER IN RECENT CONTRIBUTORS SECTION
$('#alphabetic').click(e => {
  e.preventDefault();
  toolbox.filter(org, 'alphabetic');
});

$('#mostrecentfirst').click(e => {
  e.preventDefault();
  toolbox.filter(org, 'mostrecentfirst');
});

$('.stale').hover((e) => {
  e.preventDefault();
  const height = $('.stale').prop('scrollHeight')
  const top = $('.stale').prop('scrollTop')
  if (top === 0) {
    $('.stale').animate({ scrollTop: height * 0.05 }, 'slow')
  }
}, (e) => {
  e.preventDefault();
})

let toolbox;

(function () {
  const org = urlHash().getUrlHashParameter('o') || 'publiclab';
  const repo = urlHash().getUrlHashParameter('r') || 'plots2';
  const ftoLabel = urlHash().getUrlHashParameter('f') || 'first-timers-only';
  const candidateLabel = urlHash().getUrlHashParameter('c') || 'fto-candidate';
  const recencyLabel = urlHash().getUrlHashParameter('l') || 'week';
  // eslint-disable-next-line no-unused-vars
  const leaderboardState = urlHash().getUrlHashParameter('s') || 'week';

  toolbox = CommunityToolbox(org, repo);
  if (repo === 'all') {
    toolbox.getIssuesForOrg(org, { qs: { labels: ftoLabel } })
      .then(displayIssuesAndFtoAuthors('.first-timers-only'));

    toolbox.getIssuesForOrg(org, { qs: { labels: candidateLabel } })
      .then(displayIssuesAndFtoAuthors('.candidates'));

    toolbox.initialize(org, repo).then((res) => {
      if (res) {
        // Fetches and shows recent contributors' list
        toolbox.showRecentContributors(org, repo, recencyLabel);
        // compile and display all contributors for given org
        toolbox.showAllContributors(org, repo);
        toolbox.dropdownInit();
        // Fetch stale issues
        toolbox.showStaleIssues(org, repo);
      }
    })
  } else {
    toolbox.api.Issues
      .getIssuesForRepo(org, repo, { qs: { labels: ftoLabel } })
      .then(displayIssuesAndFtoAuthors('.first-timers-only'));

    toolbox.api.Issues
      .getIssuesForRepo(org, repo, { qs: { labels: candidateLabel } })
      .then(displayIssuesAndFtoAuthors('.candidates'));

    toolbox.initialize(org, repo).then((res) => {
      if (res) {
        // Fetches and shows recent contributors' list
        toolbox.showRecentContributors(org, repo, recencyLabel);
        // compile and display all contributors for given repo
        toolbox.showRepoContributors(org, repo);
        toolbox.dropdownInit();
        // Fetch stale issues
        toolbox.showStaleIssues(org, repo);
      }
    })
  }

  function displayIssuesAndFtoAuthors (selector) {
    const ftoAuthorSet = new Set([]);
    const ftoAuthArray = [];
    return function displayIssuesAndFtoAuthors (issues) {
      if (typeof issues === 'string') issues = JSON.parse(issues).items;

      issues.forEach(function (issue) {
        toolbox.issuesUI.insertIssue(issue, selector);

        issue.labels.forEach((ftoLabel) => {
          if (ftoLabel.name === 'first-timers-only' || ftoLabel.name === 'fto') {
            if (!ftoAuthorSet.has(issue.user.login)) {
              ftoAuthorSet.add(issue.user.login);
              ftoAuthArray.push(issue);
            }
          }
        })
      })
      toolbox.ftoAuthorsUI.insertFtoIssueAuthor(ftoAuthArray);
    }
  }

  // EVENT LISTENERS FOR FILTER IN RECENT CONTRIBUTORS SECTION
  $('#alphabetic').click((e) => {
    e.preventDefault();
    toolbox.filter(org, 'alphabetic');
  })

  $('#mostrecentfirst').click((e) => {
    e.preventDefault();
    toolbox.filter(org, 'mostrecentfirst');
  })

  $('#leaderboard').click((e) => {
    e.preventDefault();
    toolbox.filter(org, 'leaderboard');
  })

  $('.past').click((e) => {
    e.preventDefault();
    let timeSpan = e.target.textContent;
    $('#dropdownMenuButtonRCS > #content').html(timeSpan);
    let forMonths = 6;
    if (timeSpan.includes('Week')) {
      timeSpan = 'week';
    } else {
      const mid = timeSpan.split('Last ')[1].split(' ')[0];
      timeSpan = 'month';
      forMonths = mid;
    }
    toolbox.showRecentContributors(org, repo, timeSpan, forMonths);
  })

  $('#refresh-button').click((e) => {
    e.preventDefault();
    toolbox.clearDB().then((isDBRefreshed) => {
      if (isDBRefreshed) {
        location.reload();
      }
    })
  })

  $('.org-wide-issues').on('click', () => {
    location.href = $('.org-wide-issues').attr('href')
    location.reload();
  })
})();
