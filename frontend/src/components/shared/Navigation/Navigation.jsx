import React from "react";
import { Link } from "react-router-dom";
import styles from "./Navigation.module.css";
import { logout } from "../../../http/index";
import { setAuth } from "../../../store/authSlice";
import { useDispatch, useSelector } from "react-redux";

const Navigation = () => {
  const brandStyle = {
    color: "#fff",
    textDecoration: "none",
    fontWeight: "bold",
    fontSize: "22px",
    display: "flex",
    alignItem: "center",
  };
  const logo = {
    marginLeft: "10px",
  };

  const dispatch = useDispatch();
  const { isAuth, user } = useSelector((state) => state.auth);
  async function logoutUser() {
    try {
      const { data } = await logout();
      dispatch(setAuth(data));
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <nav className={`${styles.navbar} container`}>
      <Link style={brandStyle} to="/">
        <img src="/images/logo.png" alt="logo" />
        <span style={logo}>Codershouse</span>
      </Link>

      {isAuth && (
        <div className={styles.navRight}>
          <h3>{user?.name}</h3>
          {
            <Link to="/profile">
              <img
                className={styles.avatar}
                src={user.avatar ? user.avatar : "/images/monkey-avatar.png"}
                alt="avatar"
              />
            </Link>
          }
          <button className={styles.logoutButton} onClick={logoutUser}>
            <img src="/images/logout.png" alt="logout" />
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
