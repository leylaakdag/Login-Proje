window.onload = function () {
  const currentUser = sessionStorage.getItem("loggedInUser");
  if (!currentUser) {
    alert("Lütfen önce giriş yapın.");
    window.location.href = "index.html";
    return;
  }

  document.getElementById("usernameDisplay").innerText = currentUser;

  const userData = JSON.parse(localStorage.getItem(currentUser));
  document.getElementById("lastLogin").innerText = userData?.lastLogin || "Bilinmiyor";

  updateCurrentTime();
  setInterval(updateCurrentTime, 1000);

  populateUserTable();
};

function updateCurrentTime() {
  const now = new Date();
  document.getElementById("currentTime").innerText = now.toLocaleString("tr-TR");
}

function logout() {
  sessionStorage.removeItem("loggedInUser");
  window.location.href = "index.html";
}

function toggleDarkMode() {
  document.body.classList.toggle("dark");
}

function updatePassword() {
  const newPassword = document.getElementById("newPassword").value.trim();
  const currentUser = sessionStorage.getItem("loggedInUser");

  if (newPassword.length < 4) {
    document.getElementById("pwMessage").innerText = "Şifre en az 4 karakter olmalı.";
    return;
  }

  const userData = JSON.parse(localStorage.getItem(currentUser));
  userData.password = newPassword;

  localStorage.setItem(currentUser, JSON.stringify(userData));
  document.getElementById("pwMessage").innerText = "Şifre başarıyla güncellendi.";
  document.getElementById("newPassword").value = "";
}

function populateUserTable() {
  const tableBody = document.querySelector("#userTable tbody");
  let userCount = 0;

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith("user_") || /^[a-zA-Z0-9]+$/.test(key)) {
      try {
        const userData = JSON.parse(localStorage.getItem(key));
        if (userData?.password) {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${key.replace("user_", "")}</td>
            <td>${userData.password}</td>
          `;
          tableBody.appendChild(row);
          userCount++;
        }
      } catch {
        continue;
      }
    }
  }

  if (userCount === 0) {
    const row = document.createElement("tr");
    row.innerHTML = `<td colspan="2">Hiç kullanıcı kaydı bulunamadı.</td>`;
    tableBody.appendChild(row);
  }
}
