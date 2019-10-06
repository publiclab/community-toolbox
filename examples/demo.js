document.addEventListener('DOMContentLoaded', function () {
          
    /*Scroll to top when arrow up clicked BEGIN*/
    $(window).scroll(function() {
        var height = $(window).scrollTop();
        if (height > 100) {
            $('#back2Top').fadeIn();
        } else {
            $('#back2Top').fadeOut();
        }
    });

    $("#back2Top").click(function(event) {
        event.preventDefault();
        $("html, body").animate({ scrollTop: 0 }, "slow");
        return false;
    });
    /*Scroll to top when arrow up clicked END*/
  
    $('.stale').hover((e) => {
        e.preventDefault();
        let height = $('.stale').prop("scrollHeight")
        let top = $('.stale').prop("scrollTop")
        if(top==0) {
            $('.stale').animate({ scrollTop: height*0.05 }, 'slow')
        }
    }, (e) => {
        e.preventDefault();
    })

    var toolbox;
  
    (function() {
  
        var org = urlHash().getUrlHashParameter('o') || 'publiclab';
        var repo = urlHash().getUrlHashParameter('r') || 'plots2';
        var ftoLabel = urlHash().getUrlHashParameter('f') || 'first-timers-only';
        var hallOfFameLabel = urlHash().getUrlHashParameter('l') || 'hall-of-fame';
        var candidateLabel = urlHash().getUrlHashParameter('c') || 'fto-candidate';
        var recencyLabel = urlHash().getUrlHashParameter('l') || 'week';
        var leaderboardState = urlHash().getUrlHashParameter('s') || 'week';
  
        toolbox = CommunityToolbox(org, repo);
        if (repo === 'all') {

            toolbox.getIssuesForOrg(org, { qs: { labels: ftoLabel } })
                    .then(displayIssuesAndFtoAuthors('.first-timers-only'));

            toolbox.getIssuesForOrg(org, { qs: { labels: hallOfFameLabel } })
                    .then(displayHallOfFameIssues('.hall-of-fame'));
  
            toolbox.getIssuesForOrg(org, { qs: { labels: candidateLabel } })
                    .then(displayIssuesAndFtoAuthors('.candidates'));
  
            toolbox.initialize(org, repo).then((res)=> {
                if(res) {
                    // Fetches and shows recent contributors' list
                    toolbox.showRecentContributors(org, repo, recencyLabel);
                    // compile and display all contributors for given org
                    toolbox.showAllContributors(org, repo);
                    toolbox.dropdownInit();
                    // Fetch stale issues
                    toolbox.showStaleIssues(org, repo);
                    // Fetch hall-of-fame issues
                    toolbox.showHallOfFameIssues(org, repo);
                }
            })
  
        } else {

            toolbox.api.Issues
                   .getIssuesForRepo(org, repo, { qs: { labels: ftoLabel } })
                   .then(displayIssuesAndFtoAuthors('.first-timers-only'));

            toolbox.getIssuesForOrg(org, { qs: { labels: hallOfFameLabel } })
                   .then(displayHallOfFameIssues('.hall-of-fame'));
  
            toolbox.api.Issues
                   .getIssuesForRepo(org, repo, { qs: { labels: candidateLabel } })
                   .then(displayIssuesAndFtoAuthors('.candidates'));
  
            toolbox.initialize(org, repo).then((res)=> {
                if(res) {
                    // Fetches and shows recent contributors' list
                    toolbox.showRecentContributors(org, repo, recencyLabel);
                    // compile and display all contributors for given repo
                    toolbox.showRepoContributors(org, repo);
                    toolbox.dropdownInit();
                    // Fetch stale issues
                    toolbox.showStaleIssues(org, repo);
                    // Fetch hall-of-fame issues
                    //toolbox.showHallOfFameIssues(org, repo, hallOfFameLabel);
                }
            })
        }
  
        function displayIssuesAndFtoAuthors(selector) {
            let ftoAuthorSet = new Set([]);
            let ftoAuthArray=[];
            return function displayIssuesAndFtoAuthors(issues) {
              if (typeof issues === "string") issues = JSON.parse(issues).items;
              
                issues.forEach(function(issue) {
                toolbox.issuesUI.insertIssue(issue, selector);
  
                issue.labels.forEach((ftoLabel) => {
                  if(ftoLabel.name==="first-timers-only" || ftoLabel.name==="fto") {
                    if(!ftoAuthorSet.has(issue.user.login)) {
                      ftoAuthorSet.add(issue.user.login);
                      ftoAuthArray.push(issue);
                    }
  
                  }
                })
              })
              toolbox.ftoAuthorsUI.insertFtoIssueAuthor(ftoAuthArray);  
            }
        }

        function displayHallOfFameIssues(selector) {
            let hfoAuthorSet = new Set([]);
            let hfoAuthArray=[];
            return function displayHallOfFameIssues(issues) {
              if (typeof issues === "string") issues = JSON.parse(issues).items;

                issues.forEach(function(issue) {
                toolbox.issuesUI.insertIssue(issue, selector);

                issue.labels.forEach((hallOfFameLabel) => {
                  if(hallOfFameLabel.name==="hall-of-fame") {
                      hfoAuthorSet.add(issue.user.login);
                      hfoAuthArray.push(issue);
                  }
                })
              })
            }
        }

        // EVENT LISTENERS FOR FILTER IN RECENT CONTRIBUTORS SECTION
        $('#alphabetic').click((e)=> {
            e.preventDefault();
            toolbox.filter(org, 'alphabetic');
          })
    
        $('#mostrecentfirst').click((e)=> {
            e.preventDefault();
            toolbox.filter(org, 'mostrecentfirst');
        })
        
        $('#leaderboard').click((e)=> {
            e.preventDefault();
            toolbox.filter(org, 'leaderboard');
        })

        $(".past").click((e) => {
            e.preventDefault();
            let timeSpan = e.target.textContent;
            $('#dropdownMenuButtonRCS > #content').html(timeSpan);
            let forMonths = 6;
            if(timeSpan.includes('Week')) {
                timeSpan = 'week';
            }else {
                let mid = timeSpan.split('Last ')[1].split(' ')[0];
                timeSpan = 'month';
                forMonths = mid;
            }
            toolbox.showRecentContributors(org, repo, timeSpan, forMonths);

        })



  
    })();

})
