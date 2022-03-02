import { useCallback, useEffect, useRef } from "react";
import { useStateWithCallback } from "../hooks/useStateWithCallback";
import socketInit from "../socket";
import { ACTIONS } from "../actions";
import freeice from "freeice";

// const user = [
//   {
//     id: 1,
//     name: "Praveen",
//   },
//   {
//     id: 2,
//     name: "Ayush",
//   },
// ];

export const useWebRTC = (roomId, user) => {
  const [clients, setClients] = useStateWithCallback([]);
  const audioElements = useRef({});
  const connections = useRef({});
  const localMediaStream = useRef(null);
  const socket = useRef(null);
  const clientsRef = useRef([]);

  useEffect(() => {
    socket.current = socketInit();
  }, []);

  const addNewClient = useCallback(
    (newClient, cb) => {
      const lookingFor = clients.find((client) => client.id === newClient.id);

      if (lookingFor === undefined) {
        setClients((existingClients) => [...existingClients, newClient], cb);
      }
    },
    [clients, setClients]
  );

  // Capture media
  useEffect(() => {
    const startCapture = async () => {
      localMediaStream.current = await navigator.mediaDevices.getUserMedia({
        audio: true,
        // video: true,
      });
    };

    startCapture().then(() => {
      addNewClient({ ...user, muted: true }, () => {
        const localElement = audioElements.current[user.id];
        if (localElement) {
          localElement.volume = 0;
          localElement.srcObject = localMediaStream.current;
        }

        // socket emit JOIN socket io
        socket.current.emit(ACTIONS.JOIN, { roomId, user });
      });
    });

    return () => {
      // Leaving the room
      localMediaStream.current.getTracks().forEach((track) => track.stop());
      socket.current.emit(ACTIONS.LEAVE, { roomId });
    };
  }, []);

  useEffect(() => {
    const handleNewPeer = async ({ peerId, createOffer, user: remoteUser }) => {
      // if already connected then give warning
      if (peerId in connections.current) {
        return console.warn(
          `You are already connected with ${peerId} (${user.name})`
        );
      }

      connections.current[peerId] = new RTCPeerConnection({
        iceServers: freeice(),
      });

      // Handle new ice candidate
      connections.current[peerId].onicecandidate = (event) => {
        socket.current.emit(ACTIONS.RELAY_ICE, {
          peerId,
          icecandidate: event.candidate,
        });
      };

      // Handle on track on this connection
      connections.current[peerId].ontrack = ({ streams: [remoteStream] }) => {
        addNewClient({ ...remoteUser, muted: true }, () => {
          if (audioElements.current[remoteUser.id]) {
            audioElements.current[remoteUser.id].srcObject = remoteStream;
          } else {
            let settled = false;
            const interval = setInterval(() => {
              if (audioElements.current[remoteUser.id]) {
                audioElements.current[remoteUser.id].srcObject = remoteStream;
                settled = true;
              }
              if (settled) {
                clearInterval(interval);
              }
            }, 1000);
          }
        });
      };

      // Add local track to remote connections
      localMediaStream.current.getTracks().forEach((track) => {
        connections.current[peerId].addTrack(track, localMediaStream.current);
      });

      // Create offer
      if (createOffer) {
        const offer = await connections.current[peerId].createOffer();

        await connections.current[peerId].setLocalDescription(offer);

        // send offer to another client
        socket.current.emit(ACTIONS.RELAY_SDP, {
          peerId,
          sessionDescription: offer,
        });
      }
    };

    socket.current.on(ACTIONS.ADD_PEER, handleNewPeer);

    return () => {
      socket.current.off(ACTIONS.ADD_PEER);
    };
  }, []);

  // Handle ice candidate
  useEffect(() => {
    socket.current.on(ACTIONS.ICE_CANDIDATE, ({ peerId, icecandidate }) => {
      if (icecandidate) {
        connections.current[peerId].addIceCandidate(icecandidate);
      }
    });

    return () => {
      socket.current.off(ACTIONS.ICE_CANDIDATE);
    };
  }, []);

  // Handle SDP
  useEffect(() => {
    const handleRemoteSdp = async ({
      peerId,
      sessionDescription: remoteSessionDescription,
    }) => {
      connections.current[peerId].setRemoteDescription(
        new RTCSessionDescription(remoteSessionDescription)
      );

      // if session description is type of offer then create an answer
      if (remoteSessionDescription.type === "offer") {
        const connection = connections.current[peerId];
        const answer = await connection.createAnswer();

        connection.setLocalDescription(answer);

        socket.current.emit(ACTIONS.RELAY_SDP, {
          peerId,
          sessionDescription: answer,
        });
      }
    };
    socket.current.on(ACTIONS.SESSION_DESCRIPTION, handleRemoteSdp);

    return () => {
      socket.current.off(ACTIONS.SESSION_DESCRIPTION);
    };
  }, []);

  // Handle remove peer
  useEffect(() => {
    const handleRemovePeer = async ({ peerId, userId }) => {
      if (connections.current[peerId]) {
        connections.current[peerId].close();
      }

      delete connections.current[peerId];
      delete audioElements.current[peerId];
      setClients((list) => list.filter((client) => client.id !== userId));
    };

    socket.current.on(ACTIONS.REMOVE_PEER, handleRemovePeer);

    return () => {
      socket.current.off(ACTIONS.REMOVE_PEER);
    };
  }, []);

  useEffect(() => {
    clientsRef.current = clients;
  }, [clients]);

  //Listen for mute/unmute
  useEffect(() => {
    socket.current.on(ACTIONS.MUTE, ({ peerId, userId }) => {
      setMute(true, userId);
    });
    socket.current.on(ACTIONS.UN_MUTE, ({ peerId, userId }) => {
      setMute(false, userId);
    });
    const setMute = (mute, userId) => {
      const clientIdx = clientsRef.current
        .map((client) => client.id)
        .indexOf(userId);
      const connectedClients = JSON.parse(JSON.stringify(clientsRef.current));
      if (clientIdx > -1) {
        connectedClients[clientIdx].muted = mute;
        setClients(connectedClients);
      }
    };
  }, []);

  // Handling mute
  const handleMute = (isMute, userId) => {
    let settled = false;
    if (userId === user.id) {
      let interval = setInterval(() => {
        if (localMediaStream.current) {
          localMediaStream.current.getTracks()[0].enabled = !isMute;
          if (isMute) {
            socket.current.emit(ACTIONS.MUTE, {
              roomId,
              userId: user.id,
            });
          } else {
            socket.current.emit(ACTIONS.UN_MUTE, {
              roomId,
              userId: user.id,
            });
          }
          settled = true;
        }
        if (settled) {
          clearInterval(interval);
        }
      }, 200);
    }
  };

  const provideRef = (instance, userId) => {
    audioElements.current[userId] = instance;
  };

  return { clients, provideRef, handleMute };
};
