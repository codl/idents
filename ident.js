document.addEventListener("DOMContentLoaded", function(e){
    "use strict";
    var me = new Image();
    var canvas = document.querySelector('canvas');
    var ctx = canvas.getContext('2d');

    var last_fps_check = performance.now();
    var frames = 0;
    var successful_fps_checks = 0;

    var idents = [];

    idents.push(function (){
        var step_size = 3;

        function frame(t){
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            var x = 0;
            var xx = Math.cos(t/600) * 30;
            var y = 0;
            var yy = 0;

            for(x; x < me.width; x = x + step_size){
                var stripe_width = Math.pow(Math.sin(t/400 + -x/40)+2, 2)/6;

                yy = Math.sin(t/800 + x/300) * 40;
                for(y = 0; y < me.height; y = y + step_size){
                    var pixel_height = Math.pow(Math.cos(t/500 + -x/40)*Math.sin(t/700 + x/100)+2, 2)/6;
                    ctx.drawImage(me, x, y, step_size, step_size, xx+100, yy+100, stripe_width * step_size +.5, pixel_height * step_size +.5);
                    yy = yy + pixel_height * step_size;
                }
                xx = xx + stripe_width * step_size;
            }
        }

        function perf(modifier){
            step_size -= modifier;
        }

        return {frame: frame, perf: perf};
    });

    idents.push(function(){
        function frame(t){
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(me, 100, 100);
            canvas.style.opacity = Math.max(0, Math.cos(t/1500));
        }

        function perf(m){
            // lol
        }
        return {frame: frame, perf: perf};
    });

    idents.push(function(){
        var samples = 1500;

        function frame(t){
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for(var i = 0; i < samples; i++){
                let x = Math.floor(Math.random() * me.width);
                let y = Math.floor(Math.random() * me.height);
                ctx.drawImage(me, x, y, 1, 1, x + 100, y + 100, Math.max(1, 10000 / samples), Math.max(1, 10000 / samples));
            }
        }

        function perf(m){
            samples += m * 50;
            samples = Math.min(2500, samples);
        }

        return {frame: frame, perf: perf};
    });

    idents.push(function(){
        function frame(t){
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for(let y = 0; y < me.height; y++){
                ctx.drawImage(me, 0, y, me.width, 1, Math.cos(t/600 + y/100)* 20 + 100, y + 100, me.width, 1);
            }
        }

        function perf(m){
            // bums
        }

        return {frame: frame, perf: perf};
    });

    idents.push(function(){
        var last_clip_change = -600;
        function frame(t){
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            if(t - last_clip_change > 800){
                last_clip_change = t;
                ctx.beginPath();
                for(let i = 0; i < 5; i++){
                    ctx.rect(Math.random() * 800 - 400, Math.random() * 800 - 400, Math.random() * 400, Math.random() * 400);
                }
            }
            ctx.save();
            ctx.clip();
            ctx.drawImage(me, 0, 0, me.width, me.height, 100, 100, me.width, me.height);
            ctx.restore();
        }

        function perf(m){
            // yeah
        }

        return {frame: frame, perf: perf};
    });



    var ident = idents[Math.floor(Math.random()*idents.length)]();

    function frame(t){

        ident.frame(t);

        window.requestAnimationFrame(frame);

        frames += 1;
        if(t - last_fps_check > 1000){
            last_fps_check = t;
            if(frames > 50){
                successful_fps_checks += 1;
                if(successful_fps_checks > 8) {
                    ident.perf(+1)
                }
            }
            else {
                successful_fps_checks = 0;
                ident.perf(-1);
            }
            frames = 0;
        }
    }

    me.onload = function onload(){ window.requestAnimationFrame(frame); };
    me.src = 'me.png';

});
