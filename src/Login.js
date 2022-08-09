import "./Login.css";
import axios from "axios";
import { backendBaseURL } from "./Utils/UtilFunctions";
import { useState } from "react";
// import { useSelector, useDispatch } from "react-redux";

axios.defaults.withCredentials = true;
axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

function Login(props) {
  const [signInErrorMsg, setSignInErrorMsg] = useState(null);
  const [signUpErrorMsg, setSignUpErrorMsg] = useState(null);
  const { setUser } = props;
  // const user = useSelector((state) => state.user.user);
  // const dispatch = useDispatch();

  const handleSignUp = async (e) => {
    e.preventDefault();

    const endpoint = `${backendBaseURL}/users/signup`;
    const body = {
      name: e.target.name.value,
      email: e.target.email.value,
      password: e.target.password.value,
    };

    await axios
      .post(endpoint, body)
      .then((res) => {
        // console.log(res.data._id);
        // dispatch(setUser(res.data));
        // console.log(res.data);
        if (res.data.error) {
          setSignUpErrorMsg(res.data.error);
        } else {
          localStorage.setItem("userID", JSON.stringify(res.data._id));
          setUser(JSON.parse(localStorage.getItem("userID")));
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleSignIn = async (e) => {
    e.preventDefault();

    const endpoint = `${backendBaseURL}/users/signin`;
    const body = {
      email: e.target.email.value,
      password: e.target.password.value,
    };

    await axios
      .post(endpoint, body)
      .then((res) => {
        // console.log(res.data._id);
        if (res.data.error) {
          setSignInErrorMsg(res.data.error);
        } else {
          localStorage.setItem("userID", JSON.stringify(res.data._id));
          setUser(JSON.parse(localStorage.getItem("userID")));
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <div className="Login">
      <div className="Tasky">
        <div className="Head">
          <div className="Title">Tasky</div>
          <div className="Subtitle">The To-Do Social Network</div>
        </div>
        <div className="Body">
          <div className="Card">
            <i className="fa-solid fa-list-check"></i>
            With Tasky, you can create tasks and be alerted when their deadlines
            are approaching. Any additional information? Add a special note.
            Have a task for a friend? Send the task to them instead!
          </div>
          <div className="Card">
            <i className="fa-solid fa-users"></i>
            Invite friends to join you on Tasky! Once added, you'll recieve
            notifications of your new Tasky contacts and any tasks they share.
            Look for new contacts and visit their profiles too!
          </div>
          <div className="Card">
            <i className="fa-solid fa-comments"></i>
            Have a question or want to chat? Use the chat feature to communicate
            anyone on Tasky to discuss tasks, projects, or where to go for lunch
            next.
          </div>
        </div>
      </div>
      <div className="formsContainer">
        <div className="SignUpContainer">
          <div className="formTitle">Not A Member?</div>
          <form onSubmit={handleSignUp}>
            <div className="inputField">
              <label htmlFor="name_signUp">Name</label>
              <input type="text" id="name_signUp" name="name" required />
            </div>

            <div className="inputField">
              <label htmlFor="email_signUp">Email</label>
              <input type="text" id="email_signUp" name="email" required />
            </div>

            <div className="inputField">
              <label htmlFor="password_signUp">Password</label>
              <input
                type="password"
                id="password_signUp"
                name="password"
                required
              />
            </div>
            <div className="errorLine">
              {signUpErrorMsg ? signUpErrorMsg : ""}
            </div>
            <button>Sign Up</button>
          </form>
        </div>
        <span className="divider" />
        <div className="SignInContainer">
          <div className="formTitle">Already Joined?</div>
          <form onSubmit={handleSignIn}>
            <div className="inputField">
              <label htmlFor="email_signIn">Email</label>
              <input type="text" id="email_signIn" name="email" required />
            </div>

            <div className="inputField">
              <label htmlFor="password_signIn">Password</label>
              <input
                type="password"
                id="password_signIn"
                name="password"
                required
              />
            </div>
            <div className="errorLine">
              {signInErrorMsg ? signInErrorMsg : ""}
            </div>
            <button>Sign In</button>
          </form>
        </div>
      </div>
      <footer>© Baldwin D. Giron</footer>
    </div>
  );
}
export default Login;
