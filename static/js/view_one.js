(function($) { // Start of isolated scope.

var $container = $('#container');
var $video = $('#video');
var $canvas = $('#canvas');

var video = $video.eq(0);


function resizeVideoToWindow() {
    var width = $container.width();
    var height = width / 1280 * 720;
    console.log('Resizing to: %d by %d', width, height);

    $video.width(width);
    $video.height(height);

}

$(window).resize(resizeVideoToWindow);
resizeVideoToWindow();


function zeroFill( number, width )
{
  width -= number.toString().length;
  if ( width > 0 )
  {
    return new Array( width + (/\./.test( number ) ? 2 : 1) ).join( '0' ) + number;
  }
  return number + ""; // always return a string
}


$video.on('timeupdate', function(e) {

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
    }
});


})(jQuery); // End of isolated scope.
