document.addEventListener("DOMContentLoaded", function() {
    let copyButton = $(".copybutton");
    let body = document.querySelector('body');
    let dummyInp = document.createElement("input");
    let usernames;
    copyButton.map(function(item, ele) {
        ele.addEventListener("click", function(event) {
            event.preventDefault();
            usernames = $(this).parent().parent().find(".usernames")[0];
            let names = usernames.textContent;
            dummyInp.setAttribute('type', 'text');
            dummyInp.setAttribute('value', `${names}`);
            body.appendChild(dummyInp);
            dummyInp.select();
            document.execCommand("copy");
            dummyInp.setAttribute('type', 'hidden');
        })
    })


    dummyInp.addEventListener("copy", function(event) {
        event.preventDefault();
        if (event.clipboardData) {
            event.clipboardData.setData("text/plain", usernames.textContent);
        }
    })
  

})
