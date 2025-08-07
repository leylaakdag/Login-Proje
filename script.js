function generateStrongPassword(length = 12) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

document.addEventListener("DOMContentLoaded", function () {
  const registerForm = document.getElementById("registerForm");
  const showPasswordRegister = document.getElementById("showPasswordRegister");
  const registerPasswordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirmPassword");
  const passwordStrengthMessage = document.getElementById("passwordStrength");
  const confirmPasswordMessage = document.getElementById("confirmPasswordMessage");
  const generatePasswordBtn = document.getElementById("generatePasswordBtn");

  const loginForm = document.getElementById("loginForm");
  const loginStatus = document.getElementById("loginStatus");
  const loginPasswordInput = document.getElementById("loginPassword");
  const loginUsernameInput = document.getElementById("loginUsername"); 
  const showPasswordLogin = document.getElementById("showPasswordLogin");
  const goRegisterBtn = document.getElementById("goRegisterBtn");
  const forgotPasswordLink = document.getElementById("forgotPasswordLink");

  const rememberMeCheckbox = document.getElementById("rememberMe"); 

  if (showPasswordRegister && registerPasswordInput) {
    showPasswordRegister.addEventListener("change", function () {
      registerPasswordInput.type = this.checked ? "text" : "password";
      if (confirmPasswordInput) {
        confirmPasswordInput.type = this.checked ? "text" : "password";
      }
    });
  }

  if (registerPasswordInput) {
    registerPasswordInput.addEventListener("input", function () {
      const value = registerPasswordInput.value;
      let strength = 0;

      if (value.length >= 8) strength++;
      if (/[A-Z]/.test(value)) strength++;
      if (/[a-z]/.test(value)) strength++;
      if (/[0-9]/.test(value)) strength++;
      if (/[^A-Za-z0-9]/.test(value)) strength++;

      if (value.length === 0) {
        passwordStrengthMessage.textContent = "";
      } else if (strength <= 2) {
        passwordStrengthMessage.textContent = "Şifre Gücü: Çok Zayıf";
        passwordStrengthMessage.style.color = "red";
      } else if (strength === 3) {
        passwordStrengthMessage.textContent = "Şifre Gücü: Zayıf";
        passwordStrengthMessage.style.color = "orange";
      } else if (strength === 4) {
        passwordStrengthMessage.textContent = "Şifre Gücü: Orta";
        passwordStrengthMessage.style.color = "goldenrod";
      } else if (strength === 5) {
        passwordStrengthMessage.textContent = "Şifre Gücü: Güçlü";
        passwordStrengthMessage.style.color = "green";
      }
    });
  }

  if (confirmPasswordInput && registerPasswordInput) {
    confirmPasswordInput.addEventListener("input", function () {
      if (confirmPasswordInput.value !== registerPasswordInput.value) {
        confirmPasswordMessage.textContent = "Şifreler eşleşmiyor!";
      } else {
        confirmPasswordMessage.textContent = "";
      }
    });
  }

  if (generatePasswordBtn && registerPasswordInput) {
    generatePasswordBtn.addEventListener("click", function () {
      const newPassword = generateStrongPassword();
      registerPasswordInput.value = newPassword;

      const event = new Event("input");
      registerPasswordInput.dispatchEvent(event);

      if (confirmPasswordInput) {
        confirmPasswordInput.value = newPassword;
        confirmPasswordInput.dispatchEvent(event);
      }
    });
  }

  if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const username = document.getElementById("username").value.trim();
      const password = registerPasswordInput.value;
      const confirmPassword = confirmPasswordInput ? confirmPasswordInput.value : "";
      const strengthMessage = passwordStrengthMessage.textContent;

      if (!username || !password || !confirmPassword) {
        alert("Lütfen tüm alanları doldurun.");
        return;
      }

      if (password !== confirmPassword) {
        alert("Şifreler eşleşmiyor!");
        return;
      }

      if (strengthMessage.includes("Zayıf")) {
        alert("Lütfen daha güçlü bir şifre seçin.");
        return;
      }

      if (localStorage.getItem(username)) {
        alert("Bu kullanıcı adı zaten alınmış.");
        return;
      }

      const user = {
        username: username,
        password: password
      };

      localStorage.setItem(username, JSON.stringify(user));
      alert("Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz.");
      window.location.href = "index.html";
    });
  }

  const MAX_ATTEMPTS = 3;
  const LOCK_TIME_MS = 30 * 1000;
  let attemptsLeft = parseInt(sessionStorage.getItem("loginAttempts"));
  if (isNaN(attemptsLeft)) attemptsLeft = MAX_ATTEMPTS;

  let lockEndTime = parseInt(localStorage.getItem("lockEndTime"));
  if (isNaN(lockEndTime)) lockEndTime = 0;

  function checkLock() {
    const now = Date.now();
    if (lockEndTime > now) {
      const secondsLeft = Math.ceil((lockEndTime - now) / 1000);
      loginStatus.textContent = `Çok fazla hatalı giriş yaptınız. Giriş ${secondsLeft} saniye kilitli.`;
      return true;
    } else {
      loginStatus.textContent = "";
      lockEndTime = 0;
      localStorage.removeItem("lockEndTime");
      attemptsLeft = MAX_ATTEMPTS;
      sessionStorage.setItem("loginAttempts", attemptsLeft);
      return false;
    }
  }

  const remembered = JSON.parse(localStorage.getItem("rememberedUser"));
  if (remembered && loginUsernameInput && loginPasswordInput && rememberMeCheckbox) {
    loginUsernameInput.value = remembered.username;
    loginPasswordInput.value = remembered.password;
    rememberMeCheckbox.checked = true;
  }

  if (loginForm) {
    checkLock();
    setInterval(checkLock, 1000);

    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // *** RECAPTCHA KONTROLÜ ***
      const recaptchaResponse = grecaptcha.getResponse();
      if (!recaptchaResponse) {
        loginStatus.textContent = "Lütfen robot olmadığınızı doğrulayın.";
        return;
      }
      // *** RECAPTCHA KONTROLÜ SONU ***

      if (checkLock()) return;

      const username = loginUsernameInput.value.trim();
      const password = loginPasswordInput.value;
      const storedUser = localStorage.getItem(username);

      if (!storedUser) {
        loginStatus.textContent = "Bu kullanıcı kayıtlı değil.";
        return;
      }

      const userData = JSON.parse(storedUser);

      if (userData.password === password) {
        loginStatus.style.color = "green";
        loginStatus.textContent = "Giriş başarılı! Yönlendiriliyorsunuz...";
        sessionStorage.removeItem("loginAttempts");
        localStorage.removeItem("lockEndTime");
        sessionStorage.setItem("loggedInUser", username);

        if (rememberMeCheckbox && rememberMeCheckbox.checked) {
          localStorage.setItem("rememberedUser", JSON.stringify({ username, password }));
        } else {
          localStorage.removeItem("rememberedUser");
        }

        setTimeout(() => {
          window.location.href = "dashboard.html";
          localStorage.setItem("lastLogin", new Date().toLocaleString());
        }, 3000);
      } else {
        attemptsLeft--;
        sessionStorage.setItem("loginAttempts", attemptsLeft);
        if (attemptsLeft <= 0) {
          lockEndTime = Date.now() + LOCK_TIME_MS;
          localStorage.setItem("lockEndTime", lockEndTime.toString());
          loginStatus.textContent = `Çok fazla hatalı giriş yaptınız. Giriş ${LOCK_TIME_MS / 1000} saniye kilitlendi.`;
        } else {
          loginStatus.textContent = `Şifre yanlış! Kalan deneme: ${attemptsLeft}`;
        }
      }
    });
  }

  if (showPasswordLogin && loginPasswordInput) {
    showPasswordLogin.addEventListener("change", function () {
      loginPasswordInput.type = this.checked ? "text" : "password";
    });
  }

  if (goRegisterBtn) {
    goRegisterBtn.addEventListener("click", function (e) {
      e.preventDefault();
      window.location.href = "register.html";
    });
  }

  if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener("click", function (e) {
      e.preventDefault();

      const username = prompt("Lütfen kullanıcı adınızı girin:");
      if (!username) {
        alert("Kullanıcı adı girilmedi.");
        return;
      }

      const storedUser = localStorage.getItem(username.trim());
      if (!storedUser) {
        alert("Böyle bir kullanıcı bulunamadı.");
        return;
      }

      const newPassword = generateStrongPassword(12);
      const userData = JSON.parse(storedUser);
      userData.password = newPassword;
      localStorage.setItem(username.trim(), JSON.stringify(userData));

      alert(`Şifreniz sıfırlandı.\nYeni şifreniz:\n${newPassword}\nLütfen giriş yaptıktan sonra şifrenizi değiştirin.`);
    });
  }
});

function showUsers() {
  const userList = document.getElementById("userList");
  if (!userList) return;

  userList.innerHTML = "";

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const value = localStorage.getItem(key);

    try {
      const parsed = JSON.parse(value);
      if (parsed.username && parsed.password) {
        const li = document.createElement("li");
        li.textContent = parsed.username;
        userList.appendChild(li);
      }
    } catch (e) {
      continue;
    }
  }

  if (userList.children.length === 0) {
    const li = document.createElement("li");
    li.textContent = "Henüz kayıtlı kullanıcı yok.";
    userList.appendChild(li);
  }
}
