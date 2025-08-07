document.getElementById('forgotForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const newPassword = document.getElementById('newPassword').value;
  const resetMessage = document.getElementById('resetMessage');
  const goLoginBtn = document.getElementById('goLoginBtn');

  const userDataJSON = localStorage.getItem(username);

  if (!userDataJSON) {
    resetMessage.textContent = "Bu kullanıcı adına ait bir hesap bulunamadı.";
    resetMessage.style.color = "red";
    goLoginBtn.style.display = "none";
    return;
  }

  if (newPassword.length < 6) {
    resetMessage.textContent = "Şifre en az 6 karakter olmalıdır.";
    resetMessage.style.color = "red";
    goLoginBtn.style.display = "none";
    return;
  }

  const userData = JSON.parse(userDataJSON);
  userData.password = newPassword;
  localStorage.setItem(username, JSON.stringify(userData));

  resetMessage.textContent = "Şifreniz başarıyla güncellendi.";
  resetMessage.style.color = "green";

  goLoginBtn.style.display = "inline-block";
});

document.getElementById('showNewPassword').addEventListener('change', function () {
  const newPasswordInput = document.getElementById('newPassword');
  newPasswordInput.type = this.checked ? 'text' : 'password';
});

document.getElementById('goLoginBtn').addEventListener('click', function () {
  window.location.href = "index.html";
});
