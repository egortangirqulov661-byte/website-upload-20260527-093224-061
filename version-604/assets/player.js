import { H as Hls } from './hls.js';

function setupPlayer(player) {
    const button = player.querySelector('[data-play-button]');
    const video = player.querySelector('[data-video]');
    const message = player.querySelector('[data-player-message]');
    const source = player.getAttribute('data-source');

    if (!button || !video || !source) {
        return;
    }

    function setMessage(text) {
        if (message) {
            message.textContent = text || '';
        }
    }

    async function startPlayback() {
        player.classList.add('playing');
        setMessage('正在加载播放源...');

        try {
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = source;
            } else if (Hls && Hls.isSupported()) {
                const hls = new Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(source);
                hls.attachMedia(video);
                hls.on(Hls.Events.ERROR, function (event, data) {
                    if (data && data.fatal) {
                        setMessage('播放源加载失败，请稍后重试。');
                    }
                });
            } else {
                video.src = source;
            }

            await video.play();
            setMessage('');
        } catch (error) {
            setMessage('浏览器阻止了自动播放，请再次点击播放器或使用控件播放。');
            try {
                video.controls = true;
            } catch (ignored) {
                // Ignore control toggling errors.
            }
        }
    }

    button.addEventListener('click', startPlayback, { once: true });
}

document.querySelectorAll('[data-player]').forEach(setupPlayer);
