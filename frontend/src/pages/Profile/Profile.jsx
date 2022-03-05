import React from "react";
import styles from "./Profile.module.css";
import { useSelector } from "react-redux";

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  return (
    <div className="container">
      <div className={styles.profileHead}>Profile</div>
      <div className={styles.profileWrapper}>
        <div className={styles.profileCard}>
          <div className={styles.avatarName}>
            <img
              className={styles.avatar}
              src={user.avatar ? user.avatar : "/images/monkey-avatar.png"}
              alt="avatar"
            />
            <h1 className="name">{user.name}</h1>
            <button className={styles.button}>Follow</button>
          </div>
          <span className={styles.profileBio}>
            Full-stack Software Developer and Javascript Enthusiast, Who Loves
            Building Things In Javascript.🔥
          </span>
        </div>
        <div className={styles.followCount}>
          <div className={styles.counts}>
            <span className={styles.count}>25</span>
            <span>Followers</span>
          </div>
          <div className={styles.counts}>
            <span className={styles.count}>0</span>
            <span>Following</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
