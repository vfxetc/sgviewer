
v = $('video')[0];

function zeroFill( number, width )
{
  width -= number.toString().length;
  if ( width > 0 )
  {
    return new Array( width + (/\./.test( number ) ? 2 : 1) ).join( '0' ) + number;
  }
  return number + ""; // always return a string
}

$(v).on('mousedown', function(e) {
    console.log('mousedown', e);
})

$(v).on('timeupdate', function(e) { 
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
            if (v.paused) {
                v.play();
            } else {
                v.pause();
            }
            break;

        case 37: // left
            v.pause();
            v.currentTime -= 1 / 24;
            break;

        case 39: // right
            v.pause();
            v.currentTime += 1 / 24; 
            break;
    }
});
