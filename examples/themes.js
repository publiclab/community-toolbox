//===============================================================
//      NIGHT MODE LOGIC
//===============================================================
  $(document).ready(() => {
    var body=document.querySelector('body');
    var toggleButton=document.getElementById('myonoffswitch');
    var toggle = localStorage.getItem('currentToggle');
    var night_adapt = document.getElementsByClassName('nightmode-adapt')[0];

    // Sets images' theme accordingly when the page is loaded
    setTimeout(()=> {
      let images=document.querySelectorAll("img");
      let inner = document.getElementsByClassName('onoffswitch-inner')[0];
      let switcher = document.getElementsByClassName('onoffswitch-switch')[0];
      

      if(toggle=='night') {
          body.style.backgroundColor = '#111111';
          body.style.filter = 'invert(1)';
          body.style.transitionProperty = 'filter';
          body.style.transitionDuration = '0.5s';
          images.forEach((image)=>{
              image.style.filter = 'invert(1) grayscale(1)';
              image.style.transitionProperty = 'filter';
              image.style.transitionDuration = '0.5s'; 
          })

          // styles for toggle button
          inner.style.marginLeft = '0px';
          switcher.style.right = '0px';
          switcher.style.backgroundColor = '#34A7C1';

      }else {
          body.style.backgroundColor = '#f8f8fa';
          body.style.filter = 'invert(0)';
          body.style.transitionProperty = 'filter';
          body.style.transitionDuration = '0.5s';
          images.forEach((image)=>{
              image.style.filter = 'invert(0) grayscale(0)';
              image.style.transitionProperty = 'filter';
              image.style.transitionDuration = '0.5s';                                                                                                                                                                                                                                          
          })
          
          // styles for toggle button
          inner.style.removeProperty('margin-left');
          switcher.style.removeProperty('right');
          switcher.style.removeProperty('background-color');
      }
    }, 1000)
        
    
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
          })
          
          // styles for toggle button
          inner.style.marginLeft = '0px';
          switcher.style.right = '0px';
          switcher.style.backgroundColor = '#34A7C1';

        }
      }, 100);    
    });


    // Converts images' theme inside recent contributors section according to the mode selected
    // every time the toggle button is clicked
    night_adapt.addEventListener("click", function (e) {
        e.preventDefault();
        setTimeout(() => {
          var recentContribsSectionImgs = document.getElementsByClassName('recent-contributors')[0].getElementsByTagName("img");
          let check=localStorage.getItem('currentToggle');
          let images = [...recentContribsSectionImgs ];
          if(check==="night") {
              images.forEach((image) => {
                  image.style.filter = 'invert(1) grayscale(1)';
                  image.style.transitionProperty = 'filter';
                  image.style.transitionDuration = '0.5s';                                                                                                                                                                                                                                            
              })
            }else {
                images.forEach((image) => {
                  image.style.filter = 'invert(0) grayscale(0)';
                  image.style.transitionProperty = 'filter';
                  image.style.transitionDuration = '0.5s';                                                                                                                                                                                                                                            
                })
            }
        }, 100);
    })

})