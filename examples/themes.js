/* eslint-disable semi */
/* eslint-disable no-undef */
//= ==============================================================
//      NIGHT MODE LOGIC
//===============================================================
  $(document).ready(() => {
    let body=document.querySelector('body');
    let toggleButton=document.getElementById('myonoffswitch');
    let toggle = localStorage.getItem('currentToggle');

  // Sets images' theme accordingly when the page is loaded
  setTimeout(() => {
    const images = document.querySelectorAll('img');
    const inner = document.getElementsByClassName('onoffswitch-inner')[0];
    const switcher = document.getElementsByClassName('onoffswitch-switch')[0];

    if (toggle === 'night') {
      body.style.backgroundColor = '#111111';
      body.style.filter = 'invert(1)';
      body.style.transitionProperty = 'filter';
      body.style.transitionDuration = '0.5s';
      images.forEach(image => {
        image.style.filter = 'invert(1) grayscale(1)';
        image.style.transitionProperty = 'filter';
        image.style.transitionDuration = '0.5s';
        image.style.transitionTimingFunction = 'linear';
      });

      // styles for toggle button
      inner.style.marginLeft = '0px';
      switcher.style.right = '0px';
      switcher.style.backgroundColor = '#34A7C1';
    } else {
      body.style.backgroundColor = '#f8f8fa';
      body.style.filter = 'invert(0)';
      body.style.transitionProperty = 'filter';
      body.style.transitionDuration = '0.5s';
      images.forEach(image => {
        image.style.filter = 'invert(0) grayscale(0)';
        image.style.transitionProperty = 'filter';
        image.style.transitionDuration = '0.5s';
        image.style.transitionTimingFunction = 'linear';
      });

      }else {
          body.style.backgroundColor = '#f8f8fa';
          body.style.filter = 'invert(0)';
          body.style.transitionProperty = 'filter';
          body.style.transitionDuration = '0.5s';
          images.forEach((image)=>{
              image.style.filter = 'invert(0) grayscale(0)';
              image.style.transitionProperty = 'filter';
              image.style.transitionDuration = '0.5s';
              image.style.transitionTimingFunction = 'linear';
          })
          
          // styles for toggle button
          inner.style.removeProperty('margin-left');
          switcher.style.removeProperty('right');
          switcher.style.removeProperty('background-color');
      }
    }, 2000)
        
    
    // Toggles the theme of the page
    toggleButton.addEventListener("click", function (e) {
      let inner = document.getElementsByClassName('onoffswitch-inner')[0];
      let switcher = document.getElementsByClassName('onoffswitch-switch')[0];

      setTimeout(()=> {
        let images=document.querySelectorAll("img");
        let check=localStorage.getItem('currentToggle');
        
        if(check==="night") {
          localStorage.setItem('currentToggle', 'day');
          body.style.backgroundColor = '#f8f8fa';
          body.style.filter = 'invert(0)';
          body.style.transitionProperty = 'filter';
          body.style.transitionDuration = '0.5s';
          // adding grayscale filter to images
          images.forEach((image)=>{
            image.style.filter = 'invert(0) grayscale(0)';
            body.style.transitionProperty = 'filter';
            image.style.transitionDuration = '0.5s';
            image.style.transitionTimingFunction = 'linear';
          })

          // styles for toggle button
          inner.style.removeProperty('margin-left');
          switcher.style.removeProperty('right');
          switcher.style.removeProperty('background-color');

        }else {
          localStorage.setItem('currentToggle', 'night');
          body.style.backgroundColor = '#111111';
          body.style.filter = 'invert(1)';
          body.style.transitionProperty = 'filter';
          body.style.transitionDuration = '0.5s';
          // adding grayscale filter to images
          images.forEach((image)=>{
            image.style.filter = 'invert(1) grayscale(1)';
            image.style.transitionProperty = 'filter';
            image.style.transitionDuration = '0.5s';      
            image.style.transitionTimingFunction = 'linear';                                                                                                                                                                                                                                      
          })
          
          // styles for toggle button
          inner.style.marginLeft = '0px';
          switcher.style.right = '0px';
          switcher.style.backgroundColor = '#34A7C1';

        }
      }, 300);    
    });


    buttonClickCallbackNightTheme = (e) => {
      e.preventDefault();
      setTimeout(() => {
        let recentContribsSectionImgs = document.getElementsByClassName('recent-contributors')[0].getElementsByTagName("img");
        let check=localStorage.getItem('currentToggle');
        let images = [...recentContribsSectionImgs ];
        if(check==="night") {
            images.forEach((image) => {
                image.style.filter = 'grayscale(1) invert(1)';
                image.style.transitionProperty = 'filter';
                image.style.transitionDuration = '0.5s';
                image.style.transitionTimingFunction = 'linear';
            })
          }else {
              images.forEach((image) => {
                image.style.filter = 'grayscale(0) invert(0)';
                image.style.transitionProperty = 'filter';
                image.style.transitionDuration = '0.5s';
                image.style.transitionTimingFunction = 'linear';                                                                                                                                                                                                                                            
              })
          }
      }, 300);
    }
  }, 2000);

  // Toggles the theme of the page
  toggleButton.addEventListener('click', function (e) {
    const inner = document.getElementsByClassName('onoffswitch-inner')[0];
    const switcher = document.getElementsByClassName('onoffswitch-switch')[0];

    setTimeout(() => {
      const images = document.querySelectorAll('img');
      const check = localStorage.getItem('currentToggle');

      if (check === 'night') {
        localStorage.setItem('currentToggle', 'day');
        body.style.backgroundColor = '#f8f8fa';
        body.style.filter = 'invert(0)';
        body.style.transitionProperty = 'filter';
        body.style.transitionDuration = '0.5s';
        // adding grayscale filter to images
        images.forEach(image => {
          image.style.filter = 'invert(0) grayscale(0)';
          body.style.transitionProperty = 'filter';
          image.style.transitionDuration = '0.5s';
          image.style.transitionTimingFunction = 'linear';
        });

        // styles for toggle button
        inner.style.removeProperty('margin-left');
        switcher.style.removeProperty('right');
        switcher.style.removeProperty('background-color');
      } else {
        localStorage.setItem('currentToggle', 'night');
        body.style.backgroundColor = '#111111';
        body.style.filter = 'invert(1)';
        body.style.transitionProperty = 'filter';
        body.style.transitionDuration = '0.5s';
        // adding grayscale filter to images
        images.forEach(image => {
          image.style.filter = 'invert(1) grayscale(1)';
          image.style.transitionProperty = 'filter';
          image.style.transitionDuration = '0.5s';
          image.style.transitionTimingFunction = 'linear';
        });

        // styles for toggle button
        inner.style.marginLeft = '0px';
        switcher.style.right = '0px';
        switcher.style.backgroundColor = '#34A7C1';
      }
    }, 300);
  });

  buttonClickCallbackNightTheme = e => {
    e.preventDefault();
    setTimeout(() => {
      var recentContribsSectionImgs = document
        .getElementsByClassName('recent-contributors')[0]
        .getElementsByTagName('img');
      const check = localStorage.getItem('currentToggle');
      const images = [...recentContribsSectionImgs];
      if (check === 'night') {
        images.forEach(image => {
          image.style.filter = 'grayscale(1) invert(1)';
          image.style.transitionProperty = 'filter';
          image.style.transitionDuration = '0.5s';
          image.style.transitionTimingFunction = 'linear';
        });
      } else {
        images.forEach(image => {
          image.style.filter = 'grayscale(0) invert(0)';
          image.style.transitionProperty = 'filter';
          image.style.transitionDuration = '0.5s';
          image.style.transitionTimingFunction = 'linear';
        });
      }
    }, 300);
  };

  // Converts images' theme inside recent contributors section according to the mode selected
  // every time the toggle button is clicked
  $('.past').click(e => buttonClickCallbackNightTheme(e));
  $('.sort-options').click(e => buttonClickCallbackNightTheme(e));
});
