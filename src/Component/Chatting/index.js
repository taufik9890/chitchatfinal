import React, { useEffect, useRef, useState } from "react";
import "./style.css";
import Userinfo from "./Userinfo";
// import ModalImage from "react-modal-image";
import { BsPlus } from "react-icons/bs";
import { FaTelegramPlane } from "react-icons/fa";
import { CiCamera } from "react-icons/ci";
import { RxCross1 } from "react-icons/rx";
import { GrGallery } from "react-icons/gr";
import { MdKeyboardVoice } from "react-icons/md";
import { BsEmojiSmile } from "react-icons/bs";
import Camera from "react-html5-camera-photo";
import "react-html5-camera-photo/build/css/index.css";
import { useSelector } from "react-redux";
import moment from "moment/moment";
import { getDatabase, onValue, push, ref, set } from "firebase/database";
import {
  getStorage,
  ref as sref,
  uploadBytesResumable,
  getDownloadURL,
  uploadString,
  uploadBytes,
} from "firebase/storage";
import ModalImage from "react-modal-image";
import { v4 as uuidv4 } from "uuid";
import { AudioRecorder } from "react-audio-voice-recorder";
import EmojiPicker from "emoji-picker-react";

const Chatting = () => {
  const [open, setOpen] = useState(false);
  const [openCam, setOpenCam] = useState(false);
  const [msg, setMsg] = useState("");
  const [grpMsg, setGrpMsg] = useState("");
  const [msgList, setMsgList] = useState([]);
  const [grpmsgList, setGrpmsgList] = useState([]);
  const [grpMembers, setGrpMembers] = useState([]);
  const scrollMsg = useRef();
  const [captureImage, setCaptureImage] = useState("");
  const [audioURL, setAudioURL] = useState("");
  const [blob, setBlob] = useState("");
  const [showAudio, setShowAudio] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const activeChatName = useSelector((active) => active.activeChat.active);
  const user = useSelector((users) => users.loginSlice.login);
  const db = getDatabase();
  const storage = getStorage();

  // const randomCode = (Math.random() + 1).toString(36).substring(2);
  // console.log(randomCode);

  // camera
  function handleTakePhoto(dataUri) {
    setCaptureImage(dataUri);
    const storageRef = sref(storage, uuidv4());
    uploadString(storageRef, dataUri, "data_url").then((snapshot) => {
      getDownloadURL(storageRef).then((downloadURL) => {
        set(
          push(ref(db, "singlemsg"), {
            whosendid: user.uid,
            whosendname: user.displayName,
            whoreceiveid: activeChatName?.id,
            whoreceivename: activeChatName?.name,
            img: downloadURL,
            date: `${new Date().getFullYear()} - ${
              new Date().getMonth() + 1
            } - ${new Date().getDate()} ${new Date().getHours()} : ${new Date().getMinutes()}`,
          }).then(() => {
            setOpenCam(false);
          })
        );
      });
    });
  }

  function handleCameraStop() {
    console.log("handleCameraStop");
  }

  // send message
  const handleSendMsg = () => {
    if (activeChatName?.status === "single") {
      set(push(ref(db, "singlemsg")), {
        whosendid: user.uid,
        whosendname: user.displayName,
        whoreceiveid: activeChatName?.id,
        whoreceivename: activeChatName?.name,
        msg: msg,
        date: `${new Date().getFullYear()} - ${
          new Date().getMonth() + 1
        } - ${new Date().getDate()} ${new Date().getHours()} : ${new Date().getMinutes()}`,
      }).then(() => {
        setShowEmoji(false);
        setMsg("");
      });
    } else {
      set(push(ref(db, "groupmsg")), {
        whosendid: user.uid,
        whosendname: user.displayName,
        whoreceiveid: activeChatName?.id,
        whoreceivename: activeChatName?.name,
        adminid: activeChatName?.adminid,
        msg: msg,
        date: `${new Date().getFullYear()} - ${
          new Date().getMonth() + 1
        } - ${new Date().getDate()} ${new Date().getHours()} : ${new Date().getMinutes()}`,
      });
    }
  };

  // Enter key send message
  const handleKeyMsg = (e) => {
    if (e.key === "Enter" && e.target.value !== "") {
      handleSendMsg().then(() => {
        setShowEmoji(false);
        setMsg("");
        setGrpMsg("");
      });
    }
  };

  // show single message
  useEffect(() => {
    onValue(ref(db, "singlemsg"), (snapshot) => {
      let singlemsgArr = [];
      snapshot.forEach((item) => {
        if (
          (item.val().whosendid === user.uid &&
            item.val().whoreceiveid === activeChatName?.id) ||
          (item.val().whoreceiveid === user.uid &&
            item.val().whosendid === activeChatName?.id)
        ) {
          singlemsgArr.push(item.val());
        }
        setMsgList(singlemsgArr);
      });
    });
  }, [activeChatName?.id]);

  // get group members
  useEffect(() => {
    onValue(ref(db, "groupmembers"), (snapshot) => {
      let membersArr = [];
      snapshot.forEach((item) => {
        membersArr.push(item.val().groupid + item.val().userid);
      });
      setGrpMembers(membersArr);
    });
  }, [activeChatName?.id]);

  // show group message
  useEffect(() => {
    onValue(ref(db, "groupmsg"), (snapshot) => {
      let groupmsgArr = [];
      snapshot.forEach((item) => {
        groupmsgArr.push(item.val());
      });
      setGrpmsgList(groupmsgArr);
    });
  }, [activeChatName?.id]);

  // Image upload section from gallery
  const handleImageUpload = (e) => {
    const storageRef = sref(storage, e.target.files[0].name);
    const uploadTask = uploadBytesResumable(storageRef, e.target.files[0]);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          set(push(ref(db, "singlemsg")), {
            whosendid: user.uid,
            whosendname: user.displayName,
            whoreceiveid: activeChatName?.id,
            whoreceivename: activeChatName?.name,
            img: downloadURL,
            date: `${new Date().getFullYear()} - ${
              new Date().getMonth() + 1
            } - ${new Date().getDate()} ${new Date().getHours()} : ${new Date().getMinutes()}`,
          });
        });
      }
    );
  };

  // for audio part
  const addAudioElement = (blob) => {
    const url = URL.createObjectURL(blob);
    setAudioURL(url);
    setBlob(blob);
  };

  // For upload recorded audio
  const handleAudioUpload = () => {
    const audiostorageRef = sref(storage, audioURL);
    // 'file' comes from the Blob or File API
    uploadBytes(audiostorageRef, blob).then((snapshot) => {
      getDownloadURL(audiostorageRef).then((downloadURL) => {
        set(push(ref(db, "singlemsg")), {
          whosendid: user.uid,
          whosendname: user.displayName,
          whoreceiveid: activeChatName?.id,
          whoreceivename: activeChatName?.name,
          audio: downloadURL,
          date: `${new Date().getFullYear()} - ${
            new Date().getMonth() + 1
          } - ${new Date().getDate()} ${new Date().getHours()} : ${new Date().getMinutes()}`,
        }).then(() => {
          setAudioURL("");
        });
      });
    });
  };

  // Choose Emoji
  const handleEmojiSelect = (data) => {
    setMsg(msg + data.emoji);
    setGrpMsg(msg + data.emoji);
  };

  // scroll msg
  useEffect(() => {
    scrollMsg?.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgList]);

  return (
    <>
      <div className="chatting-box">
        <div>
          <Userinfo />
        </div>

        <div className="message">
          {activeChatName?.status === "single"
            ? msgList.map((item, i) => (
                <div ref={scrollMsg}>
                  {item.whosendid === user.uid ? (
                    item.msg ? (
                      <div className="sender-msg" key={i}>
                        <div className="sender-text">
                          <p>{item.msg}</p>
                        </div>
                        <span>
                          {moment(item.date, "YYYYMMDD h:mm").fromNow()}
                        </span>
                      </div>
                    ) : item.img ? (
                      <div className="sender-media" key={i}>
                        <div className="sender-img">
                          <ModalImage
                            small={item.img}
                            large={item.img}
                            alt="Hello World!"
                          />
                        </div>
                        <span>
                          {moment(item.date, "YYYYMMDD h:mm").fromNow()}
                        </span>
                      </div>
                    ) : (
                      <div className="sender-media" key={i}>
                        <div className="sender-img">
                          <audio src={item.audio} controls></audio>
                        </div>
                        <span>
                          {moment(item.date, "YYYYMMDD h:mm").fromNow()}
                        </span>
                      </div>
                    )
                  ) : item.msg ? (
                    <div className="receiver-msg" key={i}>
                      <div className="receiver-text">
                        <p>{item.msg}</p>
                      </div>
                      <span>
                        {moment(item.date, "YYYYMMDD hh:mm").fromNow()}
                      </span>
                    </div>
                  ) : item.img ? (
                    <div className="receiver-media" key={i}>
                      <div className="receiver-img">
                        <ModalImage
                          small={item.img}
                          large={item.img}
                          alt="Hello World!"
                        />
                      </div>
                      <span>
                        {moment(item.date, "YYYYMMDD hh:mm").fromNow()}
                      </span>
                    </div>
                  ) : (
                    <div className="receiver-media">
                      <div className="receiver-img">
                        <audio src="" controls></audio>
                      </div>
                      <span>Today, 01:49 PM</span>
                    </div>
                  )}
                </div>
              ))
            : user.uid === activeChatName?.adminid ||
              grpMembers.includes(activeChatName?.id + user.uid)
            ? grpmsgList.map((item, i) => (
                <div key={i}>
                  {item.whosendid === user.uid
                    ? item.whoreceiveid === activeChatName?.id && (
                        <div className="sender-msg" key={i}>
                          <div className="sender-text">
                            <p>{item.msg}</p>
                          </div>
                          <span>
                            {moment(item.date, "YYYYMMDD h:mm").fromNow()}
                          </span>
                        </div>
                      )
                    : item.whoreceiveid === activeChatName?.id && (
                        <div className="receiver-msg" key={i}>
                          <div className="receiver-text">
                            <p>{item.msg}</p>
                          </div>
                          <span>
                            {moment(item.date, "YYYYMMDD hh:mm").fromNow()}
                          </span>
                        </div>
                      )}
                </div>
              ))
            : "mmbr e nah se"}
        </div>

        {activeChatName?.status === "single" ? (
          <div className="message-input">
            {!showAudio && !audioURL && (
              <div className="text-inputs">
                <input
                  type="text"
                  onKeyUp={handleKeyMsg}
                  onChange={(e) => setMsg(e.target.value)}
                  value={msg}
                />
                <div className="emoji" onClick={() => setShowEmoji(!showEmoji)}>
                  <BsEmojiSmile />
                </div>

                {showEmoji && (
                  <div className="emoji-picker">
                    <EmojiPicker onEmojiClick={handleEmojiSelect} />
                  </div>
                )}

                <div className="options">
                  <div onClick={() => setOpen(!open)}>
                    <BsPlus size={30} />
                  </div>

                  {open && (
                    <div className="more">
                      <div className="camera">
                        <div onClick={() => setOpenCam(true)}>
                          <CiCamera />
                        </div>
                      </div>

                      <label>
                        <input
                          type="file"
                          onChange={handleImageUpload}
                          hidden
                        />
                        <GrGallery />
                      </label>

                      {/* <div className="gallery" onClick={handleImageUpload}>
                    <div onClick={() => chooseFile.current.click()}>
                      <GrGallery />
                    </div>
                    <input hidden type="file" ref={chooseFile} />
                  </div> */}

                      {/* <div className="voiceRecorder">
                      <MdKeyboardVoice />
                    </div> */}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div
              className="recorder-btn"
              onClick={() => setShowAudio(!showAudio)}
            >
              <AudioRecorder
                onRecordingComplete={(blob) => addAudioElement(blob)}
                audioTrackConstraints={{
                  noiseSuppression: true,
                  echoCancellation: true,
                }}
              />
            </div>

            {!showAudio && !audioURL && (
              <button
                className="send-message-main"
                type="button"
                onClick={handleSendMsg}
              >
                <FaTelegramPlane />
              </button>
            )}

            {audioURL && (
              <>
                <div className="audio-wrapper">
                  <audio controls src={audioURL}></audio>
                  <div className="audio-send" onClick={handleAudioUpload}>
                    <button>send</button>
                  </div>
                  <div className="audio-delete" onClick={() => setAudioURL("")}>
                    <button>delete</button>
                  </div>
                </div>
              </>
            )}
          </div>
        ) : user?.uid === activeChatName?.adminid ||
          grpMembers.includes(activeChatName?.id + user.uid) ? (
          <div className="message-input">
            {!showAudio && !audioURL && (
              <div className="text-inputs">
                <input
                  type="text"
                  onKeyUp={handleKeyMsg}
                  onChange={(e) => setGrpMsg(e.target.value)}
                  value={grpMsg}
                />
                <div className="emoji" onClick={() => setShowEmoji(!showEmoji)}>
                  <BsEmojiSmile />
                </div>

                {showEmoji && (
                  <div className="emoji-picker">
                    <EmojiPicker onEmojiClick={handleEmojiSelect} />
                  </div>
                )}

                <div className="options">
                  <div onClick={() => setOpen(!open)}>
                    <BsPlus size={30} />
                  </div>

                  {open && (
                    <div className="more">
                      <div className="camera">
                        <div onClick={() => setOpenCam(true)}>
                          <CiCamera />
                        </div>
                      </div>

                      <label>
                        <input
                          type="file"
                          onChange={handleImageUpload}
                          hidden
                        />
                        <GrGallery />
                      </label>

                      {/* <div className="gallery" onClick={handleImageUpload}>
                    <div onClick={() => chooseFile.current.click()}>
                      <GrGallery />
                    </div>
                    <input hidden type="file" ref={chooseFile} />
                  </div> */}

                      {/* <div className="voiceRecorder">
                      <MdKeyboardVoice />
                    </div> */}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div
              className="recorder-btn"
              onClick={() => setShowAudio(!showAudio)}
            >
              <AudioRecorder
                onRecordingComplete={(blob) => addAudioElement(blob)}
                audioTrackConstraints={{
                  noiseSuppression: true,
                  echoCancellation: true,
                }}
              />
            </div>

            {!showAudio && !audioURL && (
              <button
                className="send-message-main"
                type="button"
                onClick={handleSendMsg}
              >
                <FaTelegramPlane />
              </button>
            )}

            {audioURL && (
              <>
                <div className="audio-wrapper">
                  <audio controls src={audioURL}></audio>
                  <div className="audio-send" onClick={handleAudioUpload}>
                    <button>send</button>
                  </div>
                  <div className="audio-delete" onClick={() => setAudioURL("")}>
                    <button>delete</button>
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          "nai"
        )}
      </div>
      {openCam && (
        <div className="capture-image">
          <div className="close-cam" onClick={() => setOpenCam(false)}>
            <RxCross1 />
          </div>
          <Camera
            onTakePhoto={(dataUri) => {
              handleTakePhoto(dataUri);
              handleCameraStop(dataUri);
            }}
          />
        </div>
      )}
    </>
  );
};

export default Chatting;
