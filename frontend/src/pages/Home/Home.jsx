import React from "react";
import styles from "./Home.module.css";
import { useHistory } from "react-router-dom";
import Card from "../../components/shared/Card/Card";
import Button from "../../components/shared/Button/Button";

const Home = () => {
  const history = useHistory();

  function startRegister() {
    history.push("/authenticate");
  }
  return (
    <div className={styles.cardWrapper}>
      <Card title={"Welcome to coderhouse!"} icon={"logo"}>
        <p className={styles.text}>
          Welcome to Coder's House!
          <br />
          <span>Coder's House is a Real-time Podcast Application.</span>
        </p>
        <Button onClick={startRegister} text={"Let's Go"} />
        <div className={styles.signWrapper}>
          {/* <span className={styles.hasInvite}>Have an invite text?</span> */}
        </div>
      </Card>
    </div>
  );
};

export default Home;
