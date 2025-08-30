import { Button } from "@mui/material";
import React from "react";
import { Cropper } from "react-cropper";
import { AiOutlineClose } from "react-icons/ai";
import "cropperjs/dist/cropper.css";
import "./style.css";

const ImageCropper = ({
  image,
  setImage,
  cropperRef,
  cropData,
  getCropData,
}) => {
  return (
    <>
      <div className="crop-image-box">
        <div className="upload-header">
          <h4>Upload Profile Picture</h4>
          <div className="close" onClick={() => setImage()}>
            <AiOutlineClose />
          </div>
        </div>
        <div className="preview-photo">
          <div className="img-preview" />
        </div>
        <div className="crop-images">
          <Cropper
            ref={cropperRef}
            style={{ height: 400, width: "100%" }}
            zoomTo={0.5}
            initialAspectRatio={1}
            preview=".img-preview"
            src={image}
            viewMode={1}
            minCropBoxHeight={10}
            minCropBoxWidth={10}
            background={false}
            responsive={true}
            autoCropArea={1}
            checkOrientation={false}
            guides={true}
          />
        </div>
        <div className="upload-btn" onClick={getCropData}>
          <Button variant="contained">Upload now</Button>
        </div>
      </div>
    </>
  );
};

export default ImageCropper;
