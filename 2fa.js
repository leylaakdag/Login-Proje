document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("verifyForm");
  const input = document.getElementById("codeInput");
  const result = document.getElementById("result");

  const correctCode = localStorage.getItem("2faCode");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const userCode = input.value.trim();

    if (userCode === correctCode) {
      result.textContent = "✅ Doğrulama başarılı! Giriş yapıldı.";
      result.style.color = "green";

      // Kod doğruysa 2FA verisini temizle
      localStorage.removeItem("2faCode");

      // Burada kullanıcıyı yönlendir
      setTimeout(() => {
        window.location.href = "dashboard.html"; // Yönlendirilecek sayfa
      }, 1500);
    } else {
      result.textContent = "❌ Kod yanlış! Lütfen tekrar deneyin.";
      result.style.color = "red";
    }
  });
});
