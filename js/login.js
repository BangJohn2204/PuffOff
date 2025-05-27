function dummyLogin() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // Dummy akun (bisa diubah)
  const dummyEmail = "user@puffoff.com";
  const dummyPassword = "123456";

  if (email === dummyEmail && password === dummyPassword) {
    // Simpan sesi login (opsional)
    localStorage.setItem("loggedIn", "true");
    // Redirect ke halaman home
    window.location.href = "home.html";
    return false;
  } else {
    // Tampilkan pesan error
    document.getElementById("login-error").style.display = "block";
    return false;
  }
}
