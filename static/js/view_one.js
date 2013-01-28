
var Shotgun = {};


(function($) { // Start of isolated scope.


Shotgun._call = function(method, data, success) {
    return $.ajax({
        'type': 'POST',
        'url': '/shotgun/' + method,
        'contentType': 'application/json',
        'dataType': 'json',
        'data': JSON.stringify(data),
        'success': success
    });
}

Shotgun.find_one = function(entity_type, filters, fields, success) {
    return this._call('find_one', {
        'entity_type': entity_type,
        'filters': filters,
        'fields': fields
    }, success);
}



var $container = $('#container');
var $video = $('#video');
var $canvas = $('#canvas');



function resizeVideoToWindow() {
    
    var controls = 39 + $('#breadcrumb').outerHeight(); // I can't figure out how to calculate this.
    var width = $(window).width();
    var height = $(window).height() - controls;

    // Determine which direction would be smaller.
    var factor = Math.min(width / 1280, height / 720);

    $video.width(1280 * factor);
    $video.height(720 * factor);
}

$(window).resize(resizeVideoToWindow);
resizeVideoToWindow();


function zeroFill( number, width )
{
  width -= number.toString().length;
  if (width > 0)
  {
    return new Array(width + (/\./.test(number) ? 2 : 1)).join('0') + number;
  }
  return number + ""; // Always return a string.
}


VideoJS.formatTime = function(t) {

    var frames = Math.floor(24 * t) + 1;
    var min = Math.floor(frames / (24 * 60));
    var sec = Math.floor(frames / 24);
    var frame = frames % 24;

    return (
        zeroFill(min, 2) + ":" +
        zeroFill(sec, 2) + ':' +
        zeroFill(frame, 2) + " (" +
        frames + ")"
    );
}


$('body').keydown(function(e) {

    if (e.target.tagName != 'BODY') {
        return;
    }

    // Need to grab this here because videojs turned our #video into a div.
    var video = $('video')[0];

    switch (e.keyCode) {

        case 32: // space
            if (video.paused) {
                video.play();
            } else {
                video.pause();
            }
            break;

        case 37: // left
            video.pause();
            video.currentTime -= 1 / 24;
            break;

        case 39: // right
            video.pause();
            video.currentTime += 1 / 24; 
            break;

        default:
            return;
    }

    // We handled it.
    e.stopPropagation();
    e.preventDefault();

});


function insert_notes(notes) {
    for (var i = 0; i < notes.length; i++) {
        var note = notes[i];
        console.log(i, note);
        var html = note_template(note);
        $(html).insertBefore('#note-form-li');
    }
}


// Get the notes.
var note_template = Handlebars.compile($('#note-template').html());
var note_api_endpoint = '/notes/' + entity_type + '/' + entity_id + '.json'
$.getJSON(note_api_endpoint, function(notes) {

    $('#notes-count').text(notes.length || 'none');
    insert_notes(notes);

    // This often adds a scrollbar, so we need to adjust the width.
    resizeVideoToWindow();

})


// Get image for new note.
if (user_id) {

    // See if we have it in localStorage.
    var image = localStorage.getItem("user_image");
    if (image) {
        $('#note-form-avatar').show().attr('src', image);
    } else {
        Shotgun.find_one('HumanUser', [['id', 'is', user_id]], ['image'], function(user) {
            localStorage.setItem("user_image", user.image);
            $('#note-form-avatar').show().attr('src', user.image);
        });
    }
}


// Create new notes.
var $form = $('form');
$form.submit(function() {

    $.ajax({
        'type': 'POST',
        'url': $form.attr('action'),
        'data': $form.serialize(),
        'dataType': 'JSON',
        success: insert_notes
    })

    this.reset();

    return false;
})
})(jQuery); // End of isolated scope.










