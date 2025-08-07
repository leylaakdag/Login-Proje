window.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.querySelector("#usersTable tbody");
  let index = 1;

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);

    if (!key.startsWith("reset_") && key !== "loginAttempts" && key !== "lockTime") {
      const username = key;
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${index++}</td>
        <td>${username}</td>
      `;

      tableBody.appendChild(tr);
    }
  }
});
