document.addEventListener('DOMContentLoaded', (e)=> {
    $.getJSON('../../config.json')
    .done((data) => {
        $('#favicon').attr("href", `${data['favicon-link']}`)
        $('#forkMe-ribbon').attr("href", `${data['forkMe-ribbon-link']}`)
        $('#codeofconduct').attr("href", `${data['code-of-conduct-link']}`)
        $(".org-display-name").each(function() {
            $(this).html(`${data['org-heading-name']}`)
        })
        $('#readme-link').attr("href", `${data['README-link']}`)
        $('#chat1').attr("href", `${data['official-chatroom-link']}`)
        $('#chat2').attr("href", `${data['gitter-chatroom-link']}`)
        $('#createissue').attr("href", `https://github.com/${data['org']}/${data['default-repository']}/issues/new`)
        $('#support-issues').attr("href", `https://github.com/${data['org']}/${data['default-repository']}/labels/${data['support-issue-label']}'`)
        
        $('.newcomer-issues').each(function() {
            $(this).html(`${data['issue-label-for-newcomer']}`)
        })
        $('.newcomer-like-issues').each(function() {
            $(this).html(`${data['issue-label-for-issues-like-newcomer']}`)
        })

        $('#newcomer-issues-link').attr("href", `https://github.com/${data['org']}/${data['default-repository']}/labels/${data['issue-label-for-newcomer']}`)
        $('#help-wanted-issues').attr("href", `https://github.com/${data['org']}/${data['default-repository']}/labels/${data['help-wanted-issue-label']}`)
        $('#help-wanted-label').html(`${data['help-wanted-issue-label']}`);

        $('.guidelines-link').each(function() {
            $(this).attr("href", `${data['newcomer-welcoming-guidelines-page-link']}`)
        })
        $('#other-ways-to-support').attr("href", `${data['other-ways-to-support-guidelines-link']}`)
        $('#fb-link').attr("href", `${data['facebook-link']}`)
        $('#twitter-link').attr("href", `${data['twitter-link']}`)
        $('#github-link').attr("href", `https://github.com/${data['org']}`)
        $('#official-link').attr("href", `${data['URL']}`)

    })
    .fail((jqxhr, textStatus, error) => {
        console.log("config loading failed, error = ", textStatus);
    })
})
