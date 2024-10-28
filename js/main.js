// Function to add and remove an active class to an element
function makeActive(event) {
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
}

