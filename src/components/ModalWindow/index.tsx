import React from "react";
import "./style.scss";

export const ModalWindow = () => {
  return (
    <div className="modalWindowContainer">
      <div className="modalWindow">
        <div className="deleteModal">
          <p>Are you sure you want to delete this note?</p>
          <div className="answerButtons">
            <button className="yesButton">Yes</button>
            <button className="noButton">No</button>
          </div>
        </div>
      </div>
    </div>
  );
};
