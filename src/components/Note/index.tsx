import React, { useState } from "react";
import "./style.scss";
import editIcon from "../../assets/pencil.svg";
import deleteIcon from "../../assets/trash.svg";
import loupeIcon from "../../assets/loupe.svg";
import closeIcon from "../../assets/close.svg";
import { ModalWindow } from "../ModalWindow";
import { NoteItem, NoteProps } from "../../share/interfaces";
import { notesStorage } from "../../share/constants";

export const Note: React.FC<NoteProps> = ({ noteInfo, changeNotesHandler }) => {
  const [modal, setModal] = useState<string | null>(null);

  const changeModalType = (type: string | null) => {
    setModal(type);
  };

  const deleteTag = (tagId: string) => {
    const allNotesStr: string = localStorage.getItem(notesStorage) as string;
    const allNotes: NoteItem[] = JSON.parse(allNotesStr);
    const noteIndex: number = allNotes.findIndex(
      (item) => item.id === noteInfo.id
    ) as number;
    const tagIndex: number = allNotes[noteIndex].tags.findIndex(
      (item) => item.id === tagId
    ) as number;

    const title: string = allNotes[noteIndex].title;
    const tagName: string = allNotes[noteIndex].tags[tagIndex].name;
    const titleTagIn: number = title.indexOf(tagName);
    const newTitle: string[] = title.split("");
    if (titleTagIn > -1) newTitle.splice(titleTagIn, 1);

    allNotes[noteIndex].title = newTitle.join("");
    allNotes[noteIndex].formattedTitle = newTitle.join("").replaceAll("#", "");
    allNotes[noteIndex].tags.splice(tagIndex, 1);

    changeNotesHandler(allNotes);
    localStorage.setItem(notesStorage, JSON.stringify(allNotes));
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
        <button onClick={() => changeModalType("newTag")} className="newTag">
          +New Tag
        </button>
        {noteInfo.tags.map((item) => {
          return (
            <div key={item.id} className="tagContainer">
              <p className="tagBlock">{item.name}</p>
              <button onClick={() => deleteTag(item.id)} className="deleteTag">
                <img src={closeIcon} className="closeIcon" alt="close" />
              </button>
            </div>
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
