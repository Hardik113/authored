$(document).ready(() => {
  $('#register').click((e) => {
    e.preventDefault();
    if($('#register-form').valid()) {
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
        alert('User has been sent an email which contains the verification link');
        localStorage.setItem('token', data.token);
        window.location = "http://localhost:8000/create-profile.html";
      },
      error: function(error) {
        console.log('error');
        if(error.status === 409) {
          alert('User already exist');
        }
      }
    });
    }
  });

  $('#login').click((e) => {
    e.preventDefault();
    
    if($('#login-form').valid()) {
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
        console.log(data);
        localStorage.setItem('token', data.token);
        window.location = 'http://localhost:8000/home.html';
      },
      error: function(error) {
        console.log('error');
        if(error.status === 404) {
          alert('User Not found');
        }
      }
    });
    }
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
});
