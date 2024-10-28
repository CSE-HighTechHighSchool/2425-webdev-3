// Function to add and remove an active class to an element
function makeActive(event) {
  var clickable = event.target;

  // Search for the parent element that has the class "clickable"
  if (!clickable.className.includes('clickable')) {
    var parent = event.target.parentNode;
    while (!parent.className.includes('clickable')) {
      parent = parent.parentNode;
    }
    clickable = parent;
  }


  // Add/Remove the active class to the element with class "clickable"
  if (clickable.className.includes(" active")) {
    clickable.className = clickable.className.replace(" active", "");
  } else {
    clickable.className = clickable.className += " active";
  }
}

