function makeActive(event) {
  var previous = document.getElementsByClassName("active");
  if (previous.length > 0) {
     previous[0].className = previous[0].className.replace(" active", "");
  }
  event.target.className += " active";
}
