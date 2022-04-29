let pass = document.getElementById("pass");
let email = document.getElementById("email");
let user = document.getElementById("user");

document.getElementById("submitBtn").addEventListener("click", (e) => {
  e.preventDefault();
  let postbody = JSON.stringify({
    user_name: user.value,
    email: email.value,
    password: pass.value,
    login: email.value,
  });
  let postheaders = {
    "content-type": "application/json",
  };
  console.log(postbody);
  fetch("/api/register", {
    method: "POST",
    body: postbody,
    headers: postheaders,
  })
    .then((response) => response.text())
    .then((x) => {
      if (x === "true") {
        window.location.href = "/login";
      } else {
        alert(x);
      }
    });
});
