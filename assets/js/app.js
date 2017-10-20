var accessToken = 'bad6bc0b4d4f430ca10e48e91c9391d8';
var baseUrl = 'https://api.api.ai/v1/';
$(document).ready(function() {
  $('form').on('submit', function(e) {
    alert('submit');
    e.preventDefault();
    return false;
  });
  $('#input').on('keypress', function(event) {
    if (event.which == 13 || event.keyCode == 13) {
      event.preventDefault();
      send();
      return false;
    }
  });
  $('#rec').on('click', function(event) {
    switchRecognition();
  });

  $(document).on('click', 'button', function(e) {
    var self = this;
    $(self)
      .closest('.response-buttons')
      .fadeUp(200);

    setTimeout(function() {
      $('#input').val(self.innerText);
      send();
    }, 500);
  });
});

function send() {
  var text = $('#input').val();
  if (text !== '') {
    $('.chat').prepend(
      '<div class="response response-user"><p>' + text + '</p></div>'
    );
    if (
      $('.response-bot')
        .first()
        .find('.response-buttons')
        .css('display') === 'block'
    ) {
      $('.response-bot')
        .first()
        .find('.response-buttons')
        .fadeUp();
    }
    $('#input').val('');
    $.ajax({
      type: 'POST',
      url: baseUrl + 'query?v=20170910',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      headers: {
        Authorization: 'Bearer ' + accessToken
      },
      data: JSON.stringify({
        query: text,
        lang: 'en',
        sessionId: 'somerandomthing'
      }),
      success: function(data) {
        setResponse(JSON.stringify(data, undefined, 2));
      },
      error: function() {
        setResponse('Internal Server Error');
      }
    });
    setResponse('Loading...');
  }
}
function setResponse(val) {
  if (val.indexOf('{') === 0) {
    var json = JSON.parse(val);

    if (json.result.fulfillment.speech) {
      var html = '';
      html += '<div class="response response-bot">';
      html +=
        '<div class="flag flag--bottom">' +
        '<div class="flag__image">' +
        '<img src="assets/img/logo.png" width="24">' +
        '</div>' +
        '<div class="flag__body">' +
        '<p>' +
        json.result.fulfillment.speech +
        '</p>' +
        '</div>' +
        '</div>';

      for (var i = 0; i < json.result.fulfillment.messages.length; i++) {
        var item = json.result.fulfillment.messages[i];
        if (item.platform === 'facebook') {
          var replies = item.replies;
          if (replies) {
            html += '<div class="response-buttons">';
            for (var j = 0; j < replies.length; j++) {
              html += '<button>' + replies[j] + '</button>';
            }

            html += '</div>';
          }
        }
      }

      html += '</div>';
      setTimeout(function() {
        $('.chat').prepend(html);
      }, 500);
    }
  }
}

var getAnimOpts = function(a, b, c) {
  if (!a) {
    return {
      duration: 'normal'
    };
  }
  if (!!c) {
    return {
      duration: a,
      easing: b,
      complete: c
    };
  }
  if (!!b) {
    return {
      duration: a,
      complete: b
    };
  }
  if (typeof a === 'object') {
    return a;
  }
  return {
    duration: a
  };
};

var getUnqueuedOpts = function(opts) {
  return {
    queue: false,
    duration: opts.duration,
    easing: opts.easing
  };
};

//Add fadeDown animation
$.fn.fadeDown = function(a, b, c) {
  var slideOpts = getAnimOpts(a, b, c),
    fadeOpts = getUnqueuedOpts(slideOpts);
  $(this)
    .hide()
    .css('opacity', 0)
    .slideDown(slideOpts)
    .animate({ opacity: 1 }, fadeOpts);
};

//Add fadeUp animation
$.fn.fadeUp = function(a, b, c) {
  var slideOpts = getAnimOpts(a, b, c),
    fadeOpts = getUnqueuedOpts(slideOpts);
  $(this)
    .show()
    .css('opacity', 1)
    .slideUp(slideOpts)
    .animate({ opacity: 0 }, fadeOpts);
};
