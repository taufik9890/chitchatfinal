import React, { createRef, useRef, useState } from "react";
import "./style.css";
import { IoMdImages } from "react-icons/io";
import ImageCropper from "./ImageCropper";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadString,
} from "firebase/storage";
import { getAuth, updateProfile } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { Loginuser } from "../../features/Slice/UserSlice";

const UploadProfile = ({ setOpen }) => {
  const [image, setImage] = useState();
  const [cropData, setCropData] = useState("#");
  const cropperRef = createRef();
  const chooseFile = useRef(null);
  const storage = getStorage();
  const storageRef = ref(storage, "some-child");
  const auth = getAuth();
  const dispatch = useDispatch();
  const user = useSelector((user) => user.loginSlice.login);

  const handleUploadFile = (e) => {
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(files[0]);
  };

  const getCropData = () => {
    if (typeof cropperRef.current?.cropper !== "undefined") {
      setCropData(cropperRef.current?.cropper.getCroppedCanvas().toDataURL());
      const message4 = cropperRef.current?.cropper
        .getCroppedCanvas()
        .toDataURL();
      uploadString(storageRef, message4, "data_url").then((snapshot) => {
        getDownloadURL(storageRef).then((downloadURL) => {
          updateProfile(auth.currentUser, {
            photoURL: downloadURL,
          }).then(() => {
            setOpen(false);
            dispatch(Loginuser({ ...user, photoURL: downloadURL }));
            localStorage.setItem(
              "users",
              JSON.stringify({ ...user, photoURL: downloadURL })
            );
          });
        });
      });
    }
  };

  return (
    <>
      <div className="upload-box">
        <input
          type="file"
          hidden
          ref={chooseFile}
          onChange={handleUploadFile}
        />
        <div className="upload" onClick={() => chooseFile.current.click()}>
          <div className="upload-icon">
            <IoMdImages />
          </div>
          <p>upload photo</p>
        </div>
        {image && (
          <ImageCropper
            image={image}
            setImage={setImage}
            cropperRef={cropperRef}
            cropData={cropData}
            getCropData={getCropData}
          />
        )}
      </div>
    </>
  );
};

export default UploadProfile;
