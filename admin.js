window.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.querySelector("#userTable tbody");

  for (let i = 0; i < localStorage.length; i++) {
    const username = localStorage.key(i);

    if (username === "admin") continue; // admin gösterilmesin

    const userData = JSON.parse(localStorage.getItem(username));

    const tr = document.createElement("tr");

    const tdUsername = document.createElement("td");
    tdUsername.textContent = username;

    const tdPassword = document.createElement("td");
    tdPassword.textContent = userData.password || "Şifre gizli";

    const tdActions = document.createElement("td");

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Sil";
    deleteBtn.onclick = () => {
      if (confirm(`${username} silinsin mi?`)) {
        localStorage.removeItem(username);
        location.reload();
      }
    };

    const resetBtn = document.createElement("button");
    resetBtn.textContent = "Şifreyi Sıfırla";
    resetBtn.onclick = () => {
      const newPass = prompt("Yeni şifre:");
      if (newPass) {
        userData.password = newPass;
        localStorage.setItem(username, JSON.stringify(userData));
        location.reload();
      }
    };

    tdActions.appendChild(deleteBtn);
    tdActions.appendChild(resetBtn);

    tr.appendChild(tdUsername);
    tr.appendChild(tdPassword);
    tr.appendChild(tdActions);

    tableBody.appendChild(tr);
  }
});
