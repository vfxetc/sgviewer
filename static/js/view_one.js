(function($) { // Start of isolated scope.

var $container = $('#container');
var $video = $('#video');
var $canvas = $('#canvas');



function resizeVideoToWindow() {
    var width = $container.width();
    var height = width / 1280 * 720;
    $video.width(width);
    $video.height(height);
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


$('video').on('timeupdate', function(e) {

    var frames = Math.floor(24 * e.target.currentTime);

    var min = Math.floor(frames / (24 * 60));
    var sec = Math.floor(frames / 24);
    var frame = frames % 24;

    $('#currentTime').text(
        zeroFill(min, 2) + ":" +
        zeroFill(sec, 2) + ':' +
        zeroFill(frame, 2) + " (" +
        frames + ")"
    )
})


$(document).keydown(function(e) {

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

});



// Get the notes.
var note_template = Handlebars.compile($('#note-template').html());
var note_api_endpoint = '/notes/' + entity_type + '/' + entity_id + '.json'
$.getJSON(note_api_endpoint, function(notes) {

    $('#notes-count').text(notes.length || 'none');
    for (var i = 0; i < notes.length; i++) {
        var note = notes[i];
        console.log(i, note);

        var html = note_template(note);
        $(html).appendTo('#notes');

    }

})



})(jQuery); // End of isolated scope.
