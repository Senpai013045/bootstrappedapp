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
    <br />
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
      <br />
      <button type="submit" class="btn btn-primary float-right">Log in</button>
      <span class="form-text text-muted"
        >Don't have an account? <a href="#" id="switchToSignup">Sign up right here</a></span
      >
    </form>
    `,
};

let formWrapper = document.querySelector(".form-wrapper");
document.addEventListener("DOMContentLoaded", () => {
  formWrapper.innerHTML = templates.signupForm;
});

formWrapper.addEventListener("click", (e) => {
  if (e.target.getAttribute("id") === "switchToLogin") {
    formWrapper.innerHTML = templates.loginForm;
  }
  if (e.target.getAttribute("id") === "switchToSignup") {
    formWrapper.innerHTML = templates.signupForm;
  }
});
