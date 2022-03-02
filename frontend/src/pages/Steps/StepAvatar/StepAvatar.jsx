import React, { useState, useEffect } from "react";
import styles from "./StepAvatar.module.css";
import Card from "../../../components/shared/Card/Card";
import Button from "../../../components/shared/Button/Button";
import { useSelector, useDispatch } from "react-redux";
import { setAvatar } from "../../../store/activateSlice";
import { activate } from "../../../http";
import { setAuth } from "../../../store/authSlice";
import Loader from "../../../components/shared/Loader/Loader";

const StepAvatar = ({ onNext }) => {
  const dispatch = useDispatch();
  const { name, avatar } = useSelector((state) => state.activate);
  const [image, setImage] = useState("/images/monkey-avatar.png");
  const [loading, setLoading] = useState(false);
  const [unMounted, setUnMounted] = useState(false);

  function captureImage(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      setImage(reader.result);
      dispatch(setAvatar(reader.result));
    };
  }

  async function submit() {
    if (!name || !avatar) return;
    setLoading(true);
    try {
      const { data } = await activate({ name, avatar });
      if (data.auth) {
        if (!unMounted) {
          dispatch(setAuth(data));
        }
      }
      console.log(data);
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    return () => {
      // cleanup
      setUnMounted(true);
    };
  }, []);
  if (loading) return <Loader message="Activation in progress..." />;
  return (
    <>
      <Card title={`Hey ${name}!`} icon="monkey-emoji">
        <div className={styles.avatarWrapper}>
          <img className={styles.avatarImage} src={image} alt="avatar" />
        </div>
        <div>
          <input
            onChange={captureImage}
            className={styles.avatarInput}
            id="avatarInput"
            type="file"
          />
          <label className={styles.inputLab} htmlFor="avatarInput">
            Choose a profile picture
          </label>
        </div>
        <div className={styles.actionButtonWrap}>
          <Button onClick={submit} text={"Next"} />
        </div>
      </Card>
    </>
  );
};

export default StepAvatar;
