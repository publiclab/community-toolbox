function renderLeaderboard(data) {
    data =[ ...data.entries() ];

  
    let names = data.map((userArray, i) => {
      return `<a href="https://github.com/${userArray[0]}">@${userArray[0]}</a>`;
    })
    let avatars = data.map((userArray, i) => {
      return `<a href="https://github.com/${userArray[0]}" title="${userArray[0]}"><img width="100px" src="https://avatars.githubusercontent.com/${userArray[0]}"></a>`;
    })

    $('.names').html(names.join(', '));
    $('.pics').html(avatars.join(''));
  }
  

module.exports = {
    renderLeaderboard: renderLeaderboard
}
