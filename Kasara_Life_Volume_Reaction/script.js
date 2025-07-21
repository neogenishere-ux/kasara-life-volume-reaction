let currentImage = "A";

navigator.mediaDevices.getUserMedia({ audio: true })
  .then(stream => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const mic = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    mic.connect(analyser);

    const dataArray = new Uint8Array(analyser.fftSize);
    const image = document.getElementById("mainImage");
    const volumeBar = document.getElementById("volumeBar");

    function animate() {
      analyser.getByteTimeDomainData(dataArray);
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        let val = (dataArray[i] - 128) / 128;
        sum += val * val;
      }
      let rms = Math.sqrt(sum / dataArray.length);
      let volume = rms * 10;

      // update volume bar
      volumeBar.style.width = Math.min(100, volume * 100) + "%";

      if (volume > 0.5 && currentImage !== "B") {
        image.src = "images/imageB.jpg";
        currentImage = "B";
      } else if (volume <= 0.5 && currentImage !== "A") {
        image.src = "images/imageA.jpg";
        currentImage = "A";
      }

      requestAnimationFrame(animate);
    }

    animate();
  })
  .catch(err => {
    console.error("Microphone access error:", err);
  });
