$(document).ready(() => {
  $('.nav-button').click(() => {
    console.log('yes');
    const nav_con = $('.nav-content');
    if (nav_con.css('display') === 'none') {
      nav_con.css({
        'display': 'block',
        'animation':'bounceInLeft 1s'
      });
    } else {
      nav_con.css('animation','bounceOutLeft 1s');
      setTimeout(function () {
        nav_con.css('display', 'none');;
      }, 800);
    }
  });

  $('#signin').click(() => {
    $('.onboard-container').css('display', 'flex');
  });

  $('#logout').click(() => {
    localStorage.clear();
    window.location = 'http://localhost:8000/index.html';
  });
});