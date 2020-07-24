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
  <li class="nav-item dropdown">
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
<li class="nav-item" id="chatLoader">
  <a href="#" class="nav-link"><i class="far fa-comments"></i> Chat</a
  >
</li>
    `,
  chats: `
    <form id="sendMessage">
    <div class="input-group">
    <input type="text" class="form-control" placeholder="chat message">
    <button type="submit" class="btn btn-primary">Send</button>
    </div>
    </form>
  `,
};

let formWrapper = document.querySelector(".form-wrapper");
let main = document.querySelector("main.container");
let nav = document.querySelector(".navbar-nav");
let createPost = document.querySelector("form#createPost");
let chats = document.querySelector("div.chats");
let brand = document.querySelector("a.navbar-brand");

//geting timestamp and changing to local time
function timeHandler(firebaseTimeStamp) {
  let date;
  if (firebaseTimeStamp) {
    date = firebaseTimeStamp.toDate();
  } else {
    date = new Date();
  }
  return {
    date: date.toLocaleDateString(),
    time: date.toLocaleTimeString(),
  };
}

auth.onAuthStateChanged((user) => {
  if (user) {
    main.innerHTML = templates.posts;
    formWrapper.innerHTML = "";
    nav.innerHTML = templates.loggedInNav;
    chats.innerHTML = templates.chats;
    chats.style.display = "none";
    chats.scrollTop = chats.scrollHeight;
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
              time: firebase.firestore.FieldValue.serverTimestamp(),
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
    //chat handler
    nav.addEventListener("click", (e) => {
      if (e.target.getAttribute("id") === "chatLoader") {
        main.style.display = "none";
        chats.style.display = "flex";
      }
    });
    //hub switching
    brand.addEventListener("click", (e) => {
      e.preventDefault();
      chats.style.display = "none";
      main.style.display = "flex";
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
            console.log(data.title, change.newIndex);
            if (!data.time) {
              data.time = null;
            }
            db.collection("users")
              .doc(data.author)
              .get()
              .then((doc) => {
                let card = document.createElement("div");
                card.classList.add("card", "mb-4");
                card.dataset.id = docID;
                card.style.order = -change.newIndex;
                card.innerHTML = `
                <div class="card-header">
                ${data.title}
                ${
                  user.uid === data.author
                    ? `<i class="fas fa-trash float-right btn btn-danger" id="delete"></i>`
                    : ``
                }
              </div>
              <div class="card-body">
                <blockquote class="blockquote mb-0">
                  <p>
                    ${data.body}
                  </p>
                  <footer class="blockquote-footer">
                    ${doc.data().displayName} <cite class="mr-1">${
                  timeHandler(data.time).date
                }</cite><cite>${timeHandler(data.time).time}</cite>
                  </footer>
                </blockquote>
              </div>
                `;
                main.insertBefore(card, main.childNodes[0]);
              });
          }
          if (change.type === "removed") {
            let card = document.querySelector(`div[data-id="${change.doc.id}"]`);
            main.removeChild(card);
          }
        });
      });
    //receiving texts
    db.collection("global")
      .orderBy("time", "asc")
      .onSnapshot((snapshot) => {
        let changes = snapshot.docChanges();
        changes.forEach((change) => {
          if (change.type === "added") {
            let docID = change.doc.id;
            let data = change.doc.data();
            console.log(data.message, change.newIndex);
            if (!data.time) {
              data.time = null;
            }
            db.collection("users")
              .doc(data.sender)
              .get()
              .then((doc) => {
                console.log(doc.data().displayName);
                //render this to doc
                let chatBubble = document.createElement("div");
                chatBubble.dataset.id = docID;

                if (data.sender === user.uid) {
                  chatBubble.classList.add("chat-bubble", "sent");
                } else {
                  chatBubble.classList.add("chat-bubble", "received");
                }

                chatBubble.innerHTML = `
        <span class="message">${data.message}</span>
        <br/>
        <cite class="float-right">-${doc.data().displayName}</cite>
                
                `;
                chats.insertBefore(chatBubble, chats.querySelector("form"));
                chats.scrollTop = chats.scrollHeight;
              });
          }
        });
      });
    //send message for chat
    chats.addEventListener("submit", (e) => {
      e.preventDefault();
      if (e.target.getAttribute("id") === "sendMessage") {
        let input = e.target.querySelector("input");
        db.collection("global")
          .add({
            message: input.value,
            sender: user.uid,
            time: firebase.firestore.FieldValue.serverTimestamp(),
          })
          .then((res) => {
            e.target.reset();
          })
          .catch((err) => {
            console.log(err);
          });
      }
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
    chats.innerHTML = "";
    chats.style.display = "none";
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
    e.preventDefault();
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

//delete feature
main.addEventListener("click", (e) => {
  if (e.target.getAttribute("id") === "delete") {
    let docID = e.target.parentElement.parentElement.dataset.id;
    db.collection("posts")
      .doc(docID)
      .delete()
      .then((res) => {
        console.log("delete successful");
      })
      .catch((err) => {
        console.log(err);
      });
  }
});
