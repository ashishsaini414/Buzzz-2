import { Fragment } from "react";
import classes from "./index.module.css";

const Moderator = (props) => {
  const moderatorHandler = async (e) => {
    if (e.target.checked === true) {
      props.isModeratorModeON(true);
    }
    if (e.target.checked === false) {
      props.isModeratorModeON(false);
    }
  };

  return (
    <Fragment>
      <div className={classes.moderator}>
        <h1 className={classes.moderatorTitle}>Moderator</h1>
        <label className={classes.switch}>
          <input type="checkbox" onChange={(e) => moderatorHandler(e)} />
          <span className={`${classes.slider} ${classes.round}`}></span>
        </label>
      </div>
    </Fragment>
  );
};

export default Moderator;
