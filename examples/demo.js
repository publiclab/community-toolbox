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


    var toolbox;
  
    (function() {
  
        var org = urlHash().getUrlHashParameter('o') || 'publiclab';
        var repo = urlHash().getUrlHashParameter('r') || 'plots2';
        var ftoLabel = urlHash().getUrlHashParameter('f') || 'first-timers-only';
        var candidateLabel = urlHash().getUrlHashParameter('c') || 'fto-candidate';
        var recencyLabel = urlHash().getUrlHashParameter('l') || 'week';
  
        toolbox = CommunityToolbox(org, repo);
  
        let d = document.getElementById('toggle-contributors');
        let recency_label = document.getElementById('recency-label');
        d.addEventListener("click", (e) => {
            e.preventDefault();
            if (recencyLabel=="week") {
                toolbox.showRecentContributors(org, repo, recencyLabel);
                d.innerHTML = "Show monthly";
                recency_label.innerHTML = "last week: ";
                recencyLabel = "month";
            }else if (recencyLabel=="month") {
                toolbox.showRecentContributors(org, repo, recencyLabel);
                d.innerHTML = "Show weekly";
                recency_label.innerHTML = "last month: ";
                recencyLabel = "week";
            }
        })
  
        if (repo === 'all') {
  
            toolbox.getIssuesForOrg(org, { qs: { labels: ftoLabel } })
                    .then(displayIssues('.first-timers-only'));
  
            toolbox.getIssuesForOrg(org, { qs: { labels: candidateLabel } })
                    .then(displayIssues('.candidates'));
  
            toolbox.initialize(org, repo).then((res)=> {
                if(res) {
                    // compile and display all contributors for given org
                    toolbox.showAllContributors(org, repo);
                    // Makes the toggle contributors list button click
                    d.click();
                    toolbox.dropdownInit();
                }
            })
  
        } else {
  
            toolbox.api.Issues
                   .getIssuesForRepo(org, repo, { qs: { labels: ftoLabel } })
                   .then(displayIssues('.first-timers-only'));
  
            toolbox.api.Issues
                   .getIssuesForRepo(org, repo, { qs: { labels: candidateLabel } })
                   .then(displayIssues('.candidates'));
  
            toolbox.initialize(org, repo).then((res)=> {
                if(res) {
                    // compile and display all contributors for given repo
                    toolbox.showRepoContributors(org, repo);
                    // Makes the toggle contributors list button click
                    d.click();
                    toolbox.dropdownInit();
                }
            })
        }
  
        function displayIssues(selector) {
            return function displayIssues(issues) {
                if (typeof issues === "string") issues = JSON.parse(issues).items;
                    issues.forEach(function(issue) {
                    toolbox.issuesUI.insertIssue(issue, selector);
                });
            }
        }
  
    })();

})
