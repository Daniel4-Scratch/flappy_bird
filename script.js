console.log("yes");

let move_speed = 3;
let gravity = 1;

document.addEventListener("DOMContentLoaded", () => { // ✅ Wrapped everything inside DOMContentLoaded to prevent null issues
    let bingus = document.querySelector('.bingus');
    let bingus_props = bingus.getBoundingClientRect();
    let background = document.querySelector('.background').getBoundingClientRect();

    let score_val = document.querySelector('.score_val');
    let message = document.querySelector('.message');
    let score_title = document.querySelector('.score_title');

    let game_state = 'Start';

    function play() {
        let pipe_seperation = 0;
        let pipe_gap = 35;

        function create_pipe() {
            if (game_state !== 'Play') return;
            if (pipe_seperation > 115) {
                pipe_seperation = 0;
                let pipe_posi = Math.floor(Math.random() * 43) + 8;

                // You forgot to do the pipe inverse!!
                let pipe_sprite_inv = document.createElement('div');
                pipe_sprite_inv.className = 'pipe_sprite';
                pipe_sprite_inv.style.top = pipe_posi - 70 + 'vh';
                pipe_sprite_inv.style.left = '100vw';
                
                // Append the created pipe element in DOM
                document.body.appendChild(pipe_sprite_inv);

                let pipe_sprite = document.createElement('div'); // ✅ Fixed incorrect element creation, 'pipe' → 'div'
                pipe_sprite.className = 'pipe_sprite';
                pipe_sprite.style.top = pipe_posi + pipe_gap + 'vh';
                pipe_sprite.style.left = '100vw';
                pipe_sprite.increase_score = '1';
                document.body.appendChild(pipe_sprite);
            }
            pipe_seperation++;
            requestAnimationFrame(create_pipe);
        }
        requestAnimationFrame(create_pipe);

        function move() {
            if (game_state !== 'Play') return;

            let pipe_sprite = document.querySelectorAll('.pipe_sprite'); // ✅ Fixed incorrect class selection, 'piper_sprite' → 'pipe_sprite'
            pipe_sprite.forEach(element => { // ✅ Removed .array before .forEach (NodeList already supports forEach)
                let pipe_sprite_props = element.getBoundingClientRect();
                bingus_props = bingus.getBoundingClientRect();

                if (pipe_sprite_props.right <= 0) {
                    element.remove();
                } else {
                    if (
                        bingus_props.left < pipe_sprite_props.right &&
                        bingus_props.right > pipe_sprite_props.left &&
                        bingus_props.top < pipe_sprite_props.bottom &&
                        bingus_props.bottom > pipe_sprite_props.top
                    ) {
                        game_state = "End";
                        message.textContent = 'Press Enter to Restart';
                        message.style.left = '28vw'; // ✅ Fixed typo 'keft' → 'left'
                    } else {
                        if (pipe_sprite_props.right < bingus_props.left &&
                            pipe_sprite_props.right + move_speed >= bingus_props.left &&
                            element.increase_score === '1') {
                            score_val.textContent++;
                        }
                        element.style.left = pipe_sprite_props.left - move_speed + 'px';
                    }
                }
            });
            requestAnimationFrame(move);
        }
        requestAnimationFrame(move);

        let bird_dy = 0;

        function apply_gravity() {
            if (game_state !== 'Play') return;

            bird_dy += gravity;
            document.addEventListener('keydown', function (e) {
                if (e.key === 'ArrowUp' || e.key === ' ') {
                    bird_dy = -7.6;
                }
            });

            if (bingus_props.top <= 0 || bingus_props.bottom >= background.bottom) {
                game_state = 'End';
                message.textContent = 'Press Enter to Restart';
                message.style.left = '28vw';
                return;
            }

            bingus.style.top = bingus_props.top + bird_dy + 'px'; // ✅ Fixed incorrect variable reference, 'bird_style' → 'bingus.style'
            bingus_props = bingus.getBoundingClientRect(); // ✅ Fixed incorrect property assignment, 'bird_dy.props' → 'bingus_props = bingus.getBoundingClientRect()'
            requestAnimationFrame(apply_gravity);
        }
        requestAnimationFrame(apply_gravity);
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && game_state !== 'Play') {
            document.querySelectorAll('.pipe_sprite').forEach((e) => e.remove());
            bingus.style.top = '40vh';
            game_state = 'Play';
            message.textContent = '';
            score_title.textContent = 'Score : ';
            score_val.textContent = '0';
            play();
        }
    });
});
