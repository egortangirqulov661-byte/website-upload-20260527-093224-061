
(function () {
  const video = document.getElementById('videoPlayer');
  const startButton = document.querySelector('.js-player-start');
  const status = document.getElementById('playerStatus');
  const sourceTabs = Array.from(document.querySelectorAll('.source-tab'));
  let hlsInstance = null;

  if (!video || !startButton) {
    return;
  }

  function setStatus(message) {
    if (status) {
      status.textContent = message;
    }
  }

  function destroyHls() {
    if (hlsInstance) {
      hlsInstance.destroy();
      hlsInstance = null;
    }
  }

  function activeSource() {
    const active = document.querySelector('.source-tab.is-active');
    return (active && active.dataset.source) || startButton.dataset.source;
  }

  function loadSource(source) {
    if (!source) {
      setStatus('未找到可用播放源。');
      return;
    }

    startButton.classList.add('is-hidden');
    setStatus('正在初始化 HLS 播放源...');
    destroyHls();

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
      video.play().then(function () {
        setStatus('正在播放：当前浏览器使用原生 HLS。');
      }).catch(function () {
        setStatus('播放已就绪，请再次点击视频播放按钮。');
      });
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });

      hlsInstance.loadSource(source);
      hlsInstance.attachMedia(video);
      hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
        video.play().then(function () {
          setStatus('正在播放：HLS 已成功初始化。');
        }).catch(function () {
          setStatus('播放源已加载，请点击视频控件开始播放。');
        });
      });
      hlsInstance.on(window.Hls.Events.ERROR, function (_event, data) {
        if (data && data.fatal) {
          setStatus('当前线路加载失败，可切换备用线路重试。');
          destroyHls();
          startButton.classList.remove('is-hidden');
        }
      });
      return;
    }

    setStatus('当前浏览器不支持 HLS 播放，请更换浏览器或启用 hls.js。');
    startButton.classList.remove('is-hidden');
  }

  sourceTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      sourceTabs.forEach(function (item) {
        item.classList.remove('is-active');
      });
      tab.classList.add('is-active');
      startButton.dataset.source = tab.dataset.source;
      loadSource(tab.dataset.source);
    });
  });

  startButton.addEventListener('click', function () {
    loadSource(activeSource());
  });
})();
