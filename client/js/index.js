$(document).ready(() => {
  $('#register').click((e) => {
    e.preventDefault();
    const data = {
      first_name: $('#firstname').val(),
      last_name: $('#lastname').val(),
      email: $('#reg-email').val(),
      password: $('#reg-password').val(),
    }
    $.ajax({
			type: 'POST',
			data: JSON.stringify(data),
			contentType: 'application/json',
      url: 'http://localhost:4000/users/register',
      success: function(data) {
        console.log('success');
        console.log(data.responseJSON);
      },
      error: function(data) {
        console.log('error');
        console.log(data.responseJSON);
      }
    });
  });

  $('#login').click((e) => {
    e.preventDefault();
    const data = {
      email: $('#log-email').val(),
      password: $('#log-password').val(),
    }
    $.ajax({
			type: 'POST',
			data: JSON.stringify(data),
			contentType: 'application/json',
      url: 'http://localhost:4000/users/login',
      success: function(data) {
        console.log('success');
        console.log(data.responseJSON);
      },
      error: function(data) {
        console.log('error');
        console.log(data.responseJSON);
      }
    });
  });

  $('#sign-in').click(() => {
    $("#register-form").css({
      'display': 'none'
    });

    $("#login-form").css({
      'display': 'block'
    });
  });

  $('#sign-up').click(() => {
    $("#register-form").css({
      'display':'block'
    });

    $("#login-form").css({
      'display': 'none'
    });
  });

  $('.close').click(() => {
    $('.onboard-container').css('display','none');
  });

  $('.nav-button').click(() => {
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

});
