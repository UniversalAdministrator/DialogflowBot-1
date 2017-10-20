var accessToken = 'bad6bc0b4d4f430ca10e48e91c9391d8';
var baseUrl = 'https://api.api.ai/v1/';
$(document).ready(function() {
  $('#input').keypress(function(event) {
    if (event.which == 13) {
      event.preventDefault();
      send();
    }
  });
  $('#rec').click(function(event) {
    switchRecognition();
  });

  $(document).on('click', 'button', function(e) {
    $(this)
      .closest('.response-buttons')
      .slideUp();
    $('#input').val(this.innerText);
    send();
  });
});

function send() {
  var text = $('#input').val();
  $('.chat').append(
    '<div class="response response-user"><p>' + text + '</p></div>'
  );
  $('.response-bot')
    .last()
    .find('.response-buttons')
    .slideUp();
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
function setResponse(val) {
  let json = JSON.parse(val);
  console.log(json);

  if (json.result.fulfillment.speech) {
    var html = '';
    html += '<div class="response response-bot">';
    html +=
      '<div class="flag flag--top">' +
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
    $('.chat').append(html);
  }
}
