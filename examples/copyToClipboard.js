document.addEventListener("DOMContentLoaded", function() {
    let usernames = document.getElementById('contrib-names');
    let copyButton = document.getElementById('copybutton');
    let dummyInp = document.createElement("input");
    let body = document.querySelector('body');


    copyButton.addEventListener("click", function (event) {
        event.preventDefault();
        let names = usernames.textContent;
        dummyInp.setAttribute('type', 'text');
		dummyInp.setAttribute('value', `${names}`);
        body.appendChild(dummyInp);
        dummyInp.select();
		document.execCommand("copy");
		dummyInp.setAttribute('type', 'hidden');
    })


    dummyInp.addEventListener("copy", function(event) {
        event.preventDefault();
        if (event.clipboardData) {
            event.clipboardData.setData("text/plain", usernames.textContent);
        }
    })
  

})
