let templates = {
  signupForm: `
    <h5 class="text-center display-4">Sign up</h5>
    <form id="signup">
    <div class="from-group">
      <label for="signup-email">Email Adress</label>
      <input type="email" id="signup-email" class="form-control" required />
      <small class="form-text text-muted">Enter an email address to sign up</small>
    </div>
    <div class="from-group">
      <label for="signup-password">Password</label>
      <input type="password" id="signup-password" class="form-control" minlength="8" required />
      <small class="form-text text-muted">Enter a password,minimum 8 characters</small>
    </div>
    <div class="from-group">
      <label for="retype-password">Retype password</label>
      <input type="password" id="retype-password" class="form-control" minlength="8" required />
      <small class="form-text text-muted">Please retype the above password</small>
    </div>
    <div class="from-group">
      <label for="display">Display name</label>
      <input type="text" id="display" class="form-control" maxlength="10" required />
      <small class="form-text text-muted">Select a display name,maximum 10 characters</small>
    </div>
    <small class="form-text text-danger error-handler"></small>
    <br/>
    <button type="submit" class="btn btn-primary float-right">Sign up</button>
    <span class="form-text text-muted"
      >Already got an account? <a href="#" id="switchToLogin">Login instead</a></span
    >
  </form>
    `,
  loginForm: `
    <h5 class="text-center display-4">Log in</h5>
    <form id="login">
      <div class="from-group">
        <label for="login-email">Email Adress</label>
        <input type="email" id="login-email" class="form-control" required />
      </div>
      <div class="from-group">
        <label for="login-password">Password</label>
        <input type="password" id="login-password" class="form-control" minlength="8" required />
      </div>
     <small class="form-text text-danger error-handler"></small>
      <br />
      <button type="submit" class="btn btn-primary float-right">Log in</button>
      <span class="form-text text-muted"
        >Don't have an account? <a href="#" id="switchToSignup">Sign up right here</a></span
      >
    </form>
    `,
  posts: `
    <div class="card mb-4">
    <div class="card-header">
      A beautiful header(text-limited)
    </div>
    <div class="card-body">
      <blockquote class="blockquote mb-0">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.
        </p>
        <footer class="blockquote-footer">
          Subham01 <cite title="Source Title">Admin</cite>
        </footer>
      </blockquote>
    </div>
  </div>

  <div class="card mb-4">
    <div class="card-header">
      Something informative
    </div>
    <div class="card-body">
      <blockquote class="blockquote mb-0">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.
        </p>
        <footer class="blockquote-footer">
          Jemy <cite title="Source Title">Moderator</cite>
        </footer>
      </blockquote>
    </div>
  </div>

  <div class="card mb-4">
    <div class="card-header">
      How to use Vue js
    </div>
    <div class="card-body">
      <blockquote class="blockquote mb-0">
        <p class="text-truncate">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ut aspernatur vel aliquam
          reiciendis quam quasi doloremque autem et eius odio?
        </p>
        <footer class="blockquote-footer">Kuzuri <cite title="Source Title">User</cite></footer>
      </blockquote>
    </div>
  </div>

  <div class="card mb-4">
    <div class="card-header">
      How to use Vue js
    </div>
    <div class="card-body">
      <blockquote class="blockquote mb-0">
        <p class="text-truncate">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ut aspernatur vel aliquam
          reiciendis quam quasi doloremque autem et eius odio?
        </p>
        <footer class="blockquote-footer">Kuzuri <cite title="Source Title">User</cite></footer>
      </blockquote>
    </div>
  </div>

  <div class="card mb-4">
    <div class="card-header">
      How to use Vue js
    </div>
    <div class="card-body">
      <blockquote class="blockquote mb-0">
        <p class="text-truncate">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ut aspernatur vel aliquam
          reiciendis quam quasi doloremque autem et eius odio?
        </p>
        <footer class="blockquote-footer">Kuzuri <cite title="Source Title">User</cite></footer>
      </blockquote>
    </div>
  </div>
    `,
};

let formWrapper = document.querySelector(".form-wrapper");
let main = document.querySelector("main.container");

auth.onAuthStateChanged((user) => {
  if (user) {
    main.innerHTML = templates.posts;
    formWrapper.innerHTML = "";
  } else {
    main.innerHTML = "";
    formWrapper.innerHTML = templates.signupForm;
  }
});

document.addEventListener("DOMContentLoaded", () => {
  formWrapper.innerHTML = templates.signupForm;
  //this is printing
});

//tabbing the forms
formWrapper.addEventListener("click", (e) => {
  if (e.target.getAttribute("id") === "switchToLogin") {
    formWrapper.innerHTML = templates.loginForm;
  }
  if (e.target.getAttribute("id") === "switchToSignup") {
    formWrapper.innerHTML = templates.signupForm;
  }
});

//signup and login handler
formWrapper.addEventListener("submit", (e) => {
  //signup
  if (e.target.getAttribute("id") === "signup") {
    e.preventDefault();
    //confirm password retype
    if (e.target["signup-password"].value === e.target["retype-password"].value) {
      e.target.querySelector(".error-handler").innerHTML = "";
      //handle signup here
      auth
        .createUserWithEmailAndPassword(
          e.target["signup-email"].value,
          e.target["signup-password"].value
        )
        .then((cred) => {
          console.log(cred.user.email);
        })
        .catch((err) => {
          e.target.querySelector(".error-handler").innerHTML = err.message;
        });
    } else {
      e.target.querySelector(".error-handler").innerHTML = "Password didn't match";
    }
  }
  //login
  if (e.target.getAttribute("id") === "login") {
    //handle login here
    auth
      .signInWithEmailAndPassword(e.target["login-email"].value, e.target["login-password"].value)
      .then((cred) => {
        console.log(cred.user.email);
        e.target.querySelector(".error-handler").innerHTML = "";
      })
      .catch((err) => {
        e.target.querySelector(".error-handler").innerHTML = err.message;
      });
  }
});
