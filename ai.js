console.log("yes");

let move_speed = 3;
let gravity = 3;
let bingus = document.querySelector('.bingus');

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
            let pipe_sprite = document.createElement('div');
            pipe_sprite.className = 'pipe_sprite';
            pipe_sprite.style.position = 'absolute';
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
        let pipe_sprites = document.querySelectorAll('.pipe_sprite');
        pipe_sprites.forEach(element => {
            let pipe_sprite_props = element.getBoundingClientRect();
            let bingus_props = bingus.getBoundingClientRect();

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
                    message.style.left = '28vw';
                } else {
                    if (pipe_sprite_props.right < bingus_props.left &&
                        pipe_sprite_props.right + move_speed >= bingus_props.left &&
                        element.increase_score === '1') {
                        score_val.textContent++;
                        element.increase_score = '0';
                    }
                    element.style.left = (pipe_sprite_props.left - move_speed) + 'px';
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

        let bingus_props = bingus.getBoundingClientRect();
        if (bingus_props.top <= 0 || bingus_props.bottom >= background.bottom) {
            game_state = 'End';
            message.textContent = 'Press Enter to Restart';
            message.style.left = '28vw';
            return;
        }

        bingus.style.top = (bingus_props.top + bird_dy) + 'px';
        requestAnimationFrame(apply_gravity);
    }
    requestAnimationFrame(apply_gravity);
}
