function makeActive(event) {
  var previous = document.getElementsByClassName("active");
  if (previous.length > 0) {
     previous[0].className = previous[0].className.replace(" active", "");
  }
  event.target.className += " active";
}

var animateButton = function(e) {

  e.preventDefault;
  //reset animation
  e.target.classList.remove('animate');
  
  e.target.classList.add('animate');
  setTimeout(function(){
    e.target.classList.remove('animate');
  },700);
};

var bubblyButtons = document.getElementsByClassName("bubbly-button");

for (var i = 0; i < bubblyButtons.length; i++) {
  bubblyButtons[i].addEventListener('click', animateButton, false);
}