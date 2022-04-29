let pass = document.getElementById("pass");
let email = document.getElementById("email");

document.getElementById("submitBtn").addEventListener("click", login);

function login() {
  let postbody = JSON.stringify({
    email: email.value,
    passw: pass.value,
  });
  let postheaders = {
    "content-type": "application/json",
  };
  console.log(postbody);
  fetch("/api/login", {
    method: "POST",
    body: postbody,
    headers: postheaders,
  })
    .then((response) => response.text())
    .then((x) => {
      if (x === "false") {
        alert("email or password is invalid");
      } else {
        window.location.href = `/home`;
        sessionStorage.setItem("email", email.value);
      }
    });
}
