import React, { ChangeEvent, SyntheticEvent, useState } from "react";
import "./style.scss";
import uniqid from "uniqid";
import { NoteItem, TagItem, notesStorage } from "../../App";
import editIcon from "../../assets/pencil.svg";
import deleteIcon from "../../assets/trash.svg";
import loupeIcon from "../../assets/loupe.svg";
import { ModalWindow } from "../ModalWindow";

interface NoteProps {
  noteInfo: NoteItem;
  changeNotesHandler: (val: NoteItem[]) => void;
}

export const Note: React.FC<NoteProps> = ({ noteInfo, changeNotesHandler }) => {
  const [modal, setModal] = useState<string | null>(null);

  const changeModalType = (type: string | null) => {
    setModal(type);
  };

  return (
    <div className="note">
      <div className="showMode">
        <h3 className="noteTitle">{noteInfo.formattedTitle}</h3>
        <div className="effectButtons">
          <button
            onClick={() => changeModalType("view")}
            className="expandButton"
          >
            <img src={loupeIcon} className="logo" alt="expand" />
          </button>
          <button
            onClick={() => changeModalType("edit")}
            className="editButton"
          >
            <img src={editIcon} className="logo" alt="edit" />
          </button>
          <button
            onClick={() => changeModalType("delete")}
            className="deleteButton"
          >
            <img src={deleteIcon} className="logo" alt="delete" />
          </button>
        </div>
      </div>
      <div className="tags">
        {noteInfo.tags.map((item) => {
          return (
            <p key={item.id} className="tagBlock">
              {item.name}
            </p>
          );
        })}
      </div>
      {modal ? (
        <ModalWindow
          noteInfo={noteInfo}
          changeNotesHandler={changeNotesHandler}
          modalType={modal}
          changeModalType={changeModalType}
        />
      ) : null}
    </div>
  );
};
