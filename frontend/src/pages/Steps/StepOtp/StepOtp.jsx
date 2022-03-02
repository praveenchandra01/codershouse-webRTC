import React, { useState } from "react";
import styles from "./StepOtp.module.css";
import Card from "../../../components/shared/Card/Card";
import Button from "../../../components/shared/Button/Button";
import TextInput from "../../../components/shared/TextInput/TextInput";
import { verifyOtp } from "../../../http";
import { useSelector } from "react-redux";
import { setAuth } from "../../../store/authSlice";
import { useDispatch } from "react-redux";

const StepOtp = ({ onNext }) => {
  const [otp, setOtp] = useState("");
  const { phone, hash } = useSelector((state) => state.auth.otp);
  const dispatch = useDispatch();
  async function submit() {
    if (!otp || !phone || !hash) return;
    try {
      const { data } = await verifyOtp({ otp, phone, hash });
      console.log(data);
      dispatch(setAuth(data)); // set isAuth and user
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <>
      <div className={styles.cardWrapper}>
        <Card title="Enter OTP" icon="lock-emoji">
          <TextInput value={otp} onChange={(e) => setOtp(e.target.value)} />
          <div className={styles.actionButtonWrap}>
            <Button onClick={submit} text={"Next"} />
          </div>
          <p style={{ paddingTop: "25px" }}>Get OTP from Console</p>
        </Card>
      </div>
    </>
  );
};

export default StepOtp;
