document.addEventListener("DOMContentLoaded", function(e){
    "use strict";
    var i = new Image();
    var canvas = document.querySelector('canvas');
    var ctx = canvas.getContext('2d');

    var step_size = 3;
    function frame(t){
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        var x = 0;
        var xx = Math.cos(t/600) * 30;
        var y = 0;
        var yy = 0;

        for(x; x < i.width; x = x + step_size){
            var stripe_width = Math.pow(Math.sin(t/400 + -x/40)+2, 2)/6;

            yy = Math.sin(t/800 + x/300) * 40;
            for(y = 0; y < i.height; y = y + step_size){
                var pixel_height = Math.pow(Math.cos(t/500 + -x/40)*Math.sin(t/700 + x/100)+2, 2)/6;
                ctx.drawImage(i, x, y, step_size, step_size, xx+100, yy+100, stripe_width * step_size + 1, pixel_height * step_size + 1);
                yy = yy + pixel_height * step_size;
            }
            xx = xx + stripe_width * step_size;
        }

        window.requestAnimationFrame(frame);
    }

    i.onload = function onload(){ window.requestAnimationFrame(frame); };
    i.src = 'me.png';

});
