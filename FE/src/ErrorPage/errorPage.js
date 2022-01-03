import classes from "./errorPage.module.css";
import { useNavigate } from "react-router-dom";

const ErrorPage = (props) => {
    const navigate = useNavigate();
  return (
    <div>
      {props.isLoggedIn && (
        <h1 className={classes.errorMessage}>Invalid URL</h1>
      )}
      {!props.isLoggedIn && (
        <div>
          <h1 className={classes.errorMessage}>
            Please login and enter the correct URL
          </h1>
          <button className={classes.loginButton} onClick={()=> navigate("/", {replace: true})}>Login</button>
        </div>
      )}
    </div>
  );
};

export default ErrorPage;
