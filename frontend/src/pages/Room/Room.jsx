import React, { useState, useEffect } from "react";
import { useWebRTC } from "../../hooks/useWebRTC";
import { useParams, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import styles from "./Room.module.css";
import { getRoom } from "../../http";

const Room = () => {
  const { id: roomId } = useParams();
  const user = useSelector((state) => state.auth.user);
  const { clients, provideRef, handleMute } = useWebRTC(roomId, user);
  const history = useHistory();
  const [room, setRoom] = useState(null);
  const [isMute, setMute] = useState(true);

  useEffect(() => {
    const fetchRoom = async () => {
      const { data } = await getRoom(roomId);
      setRoom((prev) => data);
    };
    fetchRoom();
  }, [roomId]);

  useEffect(() => {
    handleMute(isMute, user.id);
  }, [isMute]);

  const handleManualLeave = () => {
    history.push("/rooms");
  };

  const handleMuteClick = (clientId) => {
    if (clientId !== user.id) return;
    setMute((isMute) => !isMute);
  };

  return (
    <div>
      <div className="container">
        <button onClick={handleManualLeave} className={styles.goBack}>
          <img src="/images/arrow-left.png" alt="arrow-left" />
          <span>All voice rooms</span>
        </button>
      </div>
      <div className={styles.clientsWrap}>
        <div className={styles.header}>
          <h2 className={styles.topic}>{room?.topic}</h2>
          <div className={styles.actions}>
            <button className={styles.actionBtn}>
              <img src="/images/palm.png" alt="palm-icon" />
            </button>
            <button onClick={handleManualLeave} className={styles.actionBtn}>
              <img src="/images/win.png" alt="win-icon" />
              <span>Leave quietly</span>
            </button>
          </div>
        </div>
        <div className={styles.clientsList}>
          {clients.map((client) => {
            return (
              <div className={styles.client} key={client.id}>
                <div className={`${!client.muted && styles.glow}`}>
                  <div className={styles.userHead}>
                    <audio
                      ref={(instance) => provideRef(instance, client.id)}
                      //controls
                      autoPlay
                    ></audio>
                    <img
                      className={styles.userAvatar}
                      src={client.avatar}
                      alt="avatar"
                    />
                    {/* <video className={styles.userAvatar}
                      ref={(instance) => provideRef(instance, client.id)}
                      //controls
                      autoPlay
                    ></video> */}
                    <button
                      onClick={() => {
                        handleMuteClick(client.id);
                      }}
                      className={styles.micBtn}
                    >
                      {client.muted ? (
                        <img src="/images/mic-mute.png" alt="mic-mute-icon" />
                      ) : (
                        <img src="/images/mic.png" alt="mic-icon" />
                      )}
                    </button>
                  </div>
                </div>
                <h4>{client.name}</h4>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Room;
