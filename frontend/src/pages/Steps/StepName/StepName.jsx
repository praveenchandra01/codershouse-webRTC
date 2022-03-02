import React, { useState } from "react";
import styles from "./StepName.module.css";
import Card from "../../../components/shared/Card/Card";
import Button from "../../../components/shared/Button/Button";
import TextInput from "../../../components/shared/TextInput/TextInput";
import { useDispatch, useSelector } from "react-redux";
import { setName } from "../../../store/activateSlice";

const StepName = ({ onNext }) => {
  const { name } = useSelector((state) => state.activate);
  const dispatch = useDispatch();
  const [fullname, setFullname] = useState(name);

  function nextStep() {
    if (!fullname) return;
    dispatch(setName(fullname));
    onNext();
  }

  return (
    <>
      <Card title="What's your full fullname?" icon="writing-emoji">
        <TextInput
          value={fullname}
          onChange={(e) => setFullname(e.target.value)}
        />
        <div className={styles.actionButtonWrap}>
          <Button onClick={nextStep} text={"Next"} />
        </div>
      </Card>
    </>
  );
};

export default StepName;
