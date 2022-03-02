import React from "react";
import styles from "./TextInput.module.css";
const Textinput = (props) => {
  return (
    <div>
      <input
        className={styles.input}
        style={{
          width: props.fullwidth === "true" ? "100%" : "inherit",
          boxSizing: "border-box",
        }}
        type="text"
        {...props}
      />
    </div>
  );
};

export default Textinput;
