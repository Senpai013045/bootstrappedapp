let templates = {
  signupForm: `
    <h5 class="text-center display-4">Sign up</h5>
    <form id="signup" class="col-sm-12 col-md-8 col-lg-6">
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
    <form id="login" class="col-sm-12 col-md-8 col-lg-6">
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
  posts: "",
  loggedInNav: `
  <li class="nav-item dropdown dropleft">
  <a
    href="#"
    class="nav-link dropdown-toggle"
    type="button"
    data-toggle="dropdown"
    aria-haspopup="true"
    aria-expanded="false"
    ><i class="far fa-user"></i> <span id="display-name"></span
  ></a>
  <div class="dropdown-menu bg-dark position-absolute" aria-labelledby="account">
    <span class="dropdown-item-text text-light" id="display-email"></span>
    <button class="btn btn-secondary btn-sm" id="signout">Sign out</button>
  </div>
</li>
<li class="nav-item">
  <a href="#" class="nav-link" data-toggle="modal" data-target="#modal-post"
    ><i class="far fa-paper-plane"></i> Post</a
  >
</li>
    `,
};

let formWrapper = document.querySelector(".form-wrapper");
let main = document.querySelector("main.container");
let nav = document.querySelector(".navbar-nav");
let createPost = document.querySelector("form#createPost");

function timeHandler(timems) {
  //that timems is time in milliseconds of GMT
  let d = new Date();
  let offset = d.getTimezoneOffset() * 60 * 1000;
  let GMTms = d.getTime() + offset;
  let date = new Date(timems).toLocaleDateString();
  let time = new Date(timems).toLocaleTimeString();
  return {
    GMTms: GMTms,
    time: time,
    date: date,
  };
}
auth.onAuthStateChanged((user) => {
  if (user) {
    main.innerHTML = templates.posts;
    formWrapper.innerHTML = "";
    nav.innerHTML = templates.loggedInNav;
    nav.querySelector("#display-email").textContent = user.email;
    //handling display name from database
    db.collection("users")
      .doc(user.uid)
      .get()
      .then((doc) => {
        nav.querySelector("#display-name").textContent = doc.data().displayName;
        //can handle database handling here as we have access to all data required
        createPost.addEventListener("submit", (e) => {
          e.preventDefault();

          db.collection("posts")
            .add({
              author: user.uid,
              title: createPost["post-title"].value,
              body: createPost["post-body"].value,
              time: Number(timeHandler().GMTms),
            })
            .then((res) => {
              createPost.reset();
              createPost.querySelector(".error-handler").innerHTML = "";
              $("#modal-post").modal("hide");
            })
            .catch((err) => {
              createPost.querySelector(".error-handler").innerHTML = err.message;
            });
        });
      });
    //db loading
    db.collection("posts")
      .orderBy("time", "asc")
      .onSnapshot((snapshot) => {
        let changes = snapshot.docChanges();
        changes.forEach((change) => {
          if (change.type === "added") {
            //load the doc in the template
            // change.doc.data() is the object that has our data
            let docID = change.doc.id;
            let data = change.doc.data();

            db.collection("users")
              .doc(data.author)
              .get()
              .then((doc) => {
                console.log();
                main.innerHTML =
                  `
              <div class="card mb-4" data-id=${docID}>
              <div class="card-header">
                ${data.title}
              </div>
              <div class="card-body">
                <blockquote class="blockquote mb-0">
                  <p>
                    ${data.body}
                  </p>
                  <footer class="blockquote-footer">
                    ${doc.data().displayName} <cite title="${timeHandler(data.time).time}">${
                    timeHandler(data.time).date
                  }</cite>
                  </footer>
                </blockquote>
              </div>
            </div>
              ` + main.innerHTML;
              });
          }
        });
      });

    //user email wont have to be reset since nav.innerHTML automatically goes empty when not logged in

    //handle signout
    nav.addEventListener("click", (e) => {
      if (e.target.getAttribute("id") === "signout") {
        auth.signOut();
        location.reload();
        //without reload..theres a bug in sign up in firebase
      }
    });

    //make sure to reset on else
  } else {
    main.innerHTML = "";
    formWrapper.innerHTML = templates.signupForm;
    nav.innerHTML = "";
  }
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
          return db.collection("users").doc(cred.user.uid).set({
            displayName: e.target["display"].value,
          });
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
        e.target.querySelector(".error-handler").innerHTML = "";
      })
      .catch((err) => {
        e.target.querySelector(".error-handler").innerHTML = err.message;
      });
  }
});
