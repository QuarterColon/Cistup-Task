import React from "react";
import { useState } from "react";
import "./form.css";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.css";
import ResultCard from "../ResultCard/ResultCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileArrowUp } from "@fortawesome/free-solid-svg-icons";

const Form = () => {
  const [images, setImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [response, setResponse] = useState();

  const handleFileChange = (event) => {
    const files = event.target.files;
    const newImages = Array.from(files).map((file) =>
      URL.createObjectURL(file)
    );

    setImages((prevImages) => [...prevImages, ...newImages]);
    setSelectedFiles((prevFiles) => [...prevFiles, ...files]);

    console.log(images[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (selectedFiles.length === 0) {
      alert("Please select at least one image.");
      return;
    }

    const formData = new FormData();
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append("images", selectedFiles[i]);
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/detect_objects", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      let resultMap = {};
      data.results.forEach((result) => {
        const { image_name, objects } = result;
        resultMap[image_name] = objects;
      });
      console.log(resultMap);

      setResponse(resultMap);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <object-detection-page>
      <div className="image-upload-form">
        <h1>Object Detection</h1>
        <p>
          Select images to upload for object detection. You can select multiple
          files.
        </p>
        <form onSubmit={handleSubmit}>
          {images.length === 0 && (
            <div className="file-upload-container">
              <div className="upload-btn-wrapper">
                <label className="custom-file-input-label">
                  <FontAwesomeIcon icon={faFileArrowUp} />
                  <h3>Upload File</h3>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    style={{ display: "none" }} // Hide the default file input
                  />
                </label>
              </div>
            </div>
          )}

          {images.length > 0 && (
            <carousel-con>
              <Carousel>
                {images.map((image, index) => (
                  <div key={index}>
                    <img src={image} alt={`Upload ${index}`} />
                  </div>
                ))}
              </Carousel>
            </carousel-con>
          )}
          <button type="submit" className="submit-button">
            Submit
          </button>
        </form>
      </div>
      {response && (
        <results-con>
          <h1>Results</h1>

          {Object.entries(response).map(([image_name, objects], index) => (
            <result-details key={index}>
              <image-name>{image_name}:</image-name>
              <ResultCard objects={objects} />
            </result-details>
          ))}
        </results-con>
      )}
    </object-detection-page>
  );
};

export default Form;
