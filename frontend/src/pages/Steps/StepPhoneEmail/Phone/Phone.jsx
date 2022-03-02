import React, { useState } from "react";
import Card from "../../../../components/shared/Card/Card";
import Button from "../../../../components/shared/Button/Button";
import TextInput from "../../../../components/shared/TextInput/TextInput";
import styles from "../StepPhoneEmail.module.css";
import { sendOtp } from "../../../../http/index";
import { useDispatch } from "react-redux";
import { setOtp } from "../../../../store/authSlice";

const Phone = ({ onNext }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const dispatch = useDispatch();
  async function submit() {
    if (!phoneNumber && phoneNumber.length !== 10) {
      alert("Phone Number Required")
      return};
    //server request
    const { data } = await sendOtp({ phone: phoneNumber }); //post req
    dispatch(setOtp({ phone: data.phone, hash: data.hash }));
    // console.log(data);
    console.log("OTP : ", data.otp);
    onNext();
  }

  return (
    <Card title={"Enter your phone number"} icon={"phone"}>
      <TextInput
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
      />
      <div className={styles.actionButtonWrap}>
        <Button text={"Next"} onClick={submit} />
      </div>
      {/* <p className={styles.dummy}> Credential : 1234567890 </p> */}
    </Card>
  );
};

export default Phone;
