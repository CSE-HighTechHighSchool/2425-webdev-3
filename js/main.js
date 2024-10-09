function makeActive(event) {
  var previous = document.getElementsByClassName(" active");

  var clickable = event.target;

  if (!clickable.className.includes('clickable')) {
    var parent = event.target.parentNode;
    while (!parent.className.includes('clickable')) {
      parent = parent.parentNode;
    }
    clickable = parent;
  }

  if (clickable.className.includes(" active")) {
      clickable.className = clickable.className.replace(" active", "");
  } else {
    clickable.className = clickable.className += " active";
  }
  /*
if (event.target.className.includes('clickable')) {
  event.target.className += " active";
} else if (event.target.parentElement.className.includes('clickable')) {
  event.target.parentElement.className += " active";
} else if (event.target.parentElement.parentElement.className.includes('clickable')) {
  event.target.parentElement.parentElement.className += " active";
}
  */
}

