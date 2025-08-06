import React, { useState } from "react";
import Modal from "./Modal";

const PropertyImg = ({ images }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  console.log(images[0].url);

  const handleShowAllPhotos = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="property-img-container">
        {/* Apply different style to the first image */}
        <div className="img-item">
          <img
            src={images[0].url}
            className="images"
            style={{
              borderTopLeftRadius: "10px",
              borderBottomLeftRadius: "10px",
            }}
            alt="property-1"
          />
        </div>
        {/* Render the remaining 4 images in a row */}
        {images.slice(1, 4).map((image, index) => (
          <div key={index}>
            <img
              className="images"
              src={image.url}
              alt={`property-${index + 2}`}
            />
          </div>
        ))}
        <div>
          <img
            className="images"
            src={images[5].url}
            alt={`property-5`}
            style={{ borderBottomRightRadius: "10px" }}
          />
          <button className="similar-photos" onClick={handleShowAllPhotos}>
            <span className="material-symbols-outlined">photo_library</span>
          </button>
        </div>
      </div>
      {/* Place the button container outside the image container */}
      <div className="similar-photos-container"></div>
      {isModalOpen && <Modal images={images} onClose={handleCloseModal} />}
    </>
  );
};

export default PropertyImg;
