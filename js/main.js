function makeActive(event) {
  var previous = document.getElementsByClassName("active");
  if (previous.length > 0) {
     previous[0].className = previous[0].className.replace(" active", "");
  }
  event.target.className += " active";
}

// Set a function onscroll - this will activate if the user scrolls
window.onscroll = function() {
  // Set the height to check for
var appear = 20
if (window.scrollY >= appear) {
  // If more show the element
  document.getElementById("bottomtop").style.opacity = '1'
  document.getElementById("bottomtop").style.pointerEvents = 'all'
} else {
  // Else hide it
  document.getElementById("bottomtop").style.opacity = '0'
  document.getElementById("bottomtop").style.pointerEvents = 'none'
}
}