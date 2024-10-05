$(".custom-carousel").owlCarousel({
  autoWidth: true,
  loop: false,
  nav: true,
  dots: false,
  rewind: true
});

$(document).ready(function () {
  $(".custom-carousel .item").click(function () {
    $(".custom-carousel .item").not($(this)).removeClass("active");
    $(this).toggleClass("active");
  });
});
