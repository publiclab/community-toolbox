document.addEventListener('DOMContentLoaded', function () {
    /* Navbar scroll to that perticular section of page */
    $('.navbar a').on('click', function(e){
        if(this.hash !== ''){
            e.preventDefault();

            const hash = this.hash;
            $('html,body').animate({
                scrollTop: $(hash).offset().top
            },800); 
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
        statusHTML += '<divs class="lang-name">' + status.language + '</div>';
        statusHTML += '</div>';
    });
    $('#tbody').html(statusHTML);
    }
    request.send();
    /* langauge section ends */


    /*Scroll to top when arrow up clicked BEGIN*/
    $(window).scroll(function() {
        let height = $(window).scrollTop();
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

    let toolbox;
  
    (function() {
  
        let org = urlHash().getUrlHashParameter('o') || 'publiclab';
        let repo = urlHash().getUrlHashParameter('r') || 'plots2';
        let ftoLabel = urlHash().getUrlHashParameter('f') || 'first-timers-only';
        let candidateLabel = urlHash().getUrlHashParameter('c') || 'fto-candidate';
        let recencyLabel = urlHash().getUrlHashParameter('l') || 'week';
        let leaderboardState = urlHash().getUrlHashParameter('s') || 'week';
  
        toolbox = CommunityToolbox(org, repo);
        if (repo === 'all') {

            toolbox.getIssuesForOrg(org, { qs: { labels: ftoLabel } })
                    .then(displayIssuesAndFtoAuthors('.first-timers-only'));
  
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
                }
            })
  
        } else {

            toolbox.api.Issues
                   .getIssuesForRepo(org, repo, { qs: { labels: ftoLabel } })
                   .then(displayIssuesAndFtoAuthors('.first-timers-only'));
  
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
