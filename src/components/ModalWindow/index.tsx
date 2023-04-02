import React, { ChangeEvent, SyntheticEvent, useEffect, useState } from "react";
import "./style.scss";
import uniqid from "uniqid";
import { convertToHtml, notesStorage, tagRegex } from "../../share/constants";
import {
  ModalWindowProps,
  NoteItem,
  TagItem,
  ViewWindowProps,
  EditWindowProps,
  DeleteWindowProps,
} from "../../share/interfaces";

export const ModalWindow: React.FC<ModalWindowProps> = ({
  noteInfo,
  changeNotesHandler,
  modalType,
  changeModalType,
}) => {
  const [input, setInput] = useState(noteInfo.title);

  const inputHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
  };

  const saveEdit = () => {
    const allNotesStr: string = localStorage.getItem(notesStorage) as string;
    const allNotes: NoteItem[] = JSON.parse(allNotesStr);
    const noteIndex: number = allNotes.findIndex(
      (item) => item.id === noteInfo.id
    ) as number;

    const tags: string[] = input.match(tagRegex) ?? [];
    const filtered: string[] = [...new Set(tags)];
    const labledTags: TagItem[] | undefined = filtered.map((item) => ({
      name: item,
      id: uniqid(),
    }));

    allNotes[noteIndex].title = input;
    allNotes[noteIndex].formattedTitle = input.replaceAll("#", "");
    if (labledTags) allNotes[noteIndex].tags = labledTags;

    changeNotesHandler(allNotes);
    localStorage.setItem(notesStorage, JSON.stringify(allNotes));
    changeModalType(null);
  };

  const deleteNote = () => {
    const allNotesStr: string = localStorage.getItem(notesStorage) as string;
    const allNotes: NoteItem[] = JSON.parse(allNotesStr);
    const noteIndex: number = allNotes.findIndex(
      (item) => item.id === noteInfo.id
    ) as number;

    allNotes.splice(noteIndex, 1);
    changeNotesHandler(allNotes);
    localStorage.setItem(notesStorage, JSON.stringify(allNotes));

    changeModalType(null);
  };

  const closeModal = () => {
    changeModalType(null);
  };

  useEffect(() => {
    const body = document.querySelector("body") as HTMLBodyElement;
    body.style.overflow = "hidden";

    return () => {
      body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="modalWindowContainer">
      <div className="modalWindow">
        {modalType === "view" ? (
          <ViewWindow noteInfo={noteInfo} closeModal={closeModal} />
        ) : modalType === "edit" ? (
          <EditWindow
            saveEdit={saveEdit}
            cancelEdit={closeModal}
            input={input}
            inputHandler={inputHandler}
          />
        ) : modalType === "delete" ? (
          <DeleteWindow deleteNote={deleteNote} cancelDelete={closeModal} />
        ) : null}
      </div>
    </div>
  );
};

const ViewWindow: React.FC<ViewWindowProps> = ({ noteInfo, closeModal }) => {
  return (
    <div className="viewModal">
      <p className="modalText">{noteInfo.formattedTitle}</p>
      <button onClick={closeModal} className="closeModal">
        Close
      </button>
    </div>
  );
};

const EditWindow: React.FC<EditWindowProps> = ({
  saveEdit,
  cancelEdit,
  input,
  inputHandler,
}) => {
  const scrollHandler = (event: SyntheticEvent<HTMLTextAreaElement>) => {
    document
      .getElementById("textareaHighlight")
      ?.scroll(event.currentTarget.scrollLeft, event.currentTarget.scrollTop);
  };

  const highlightedText = convertToHtml(input.split(""));

  return (
    <div className="editModal">
      <div className="textEdit">
        <textarea
          value={input}
          onChange={inputHandler}
          onScroll={scrollHandler}
          className="textareaField"
        />
        <div
          id="textareaHighlight"
          dangerouslySetInnerHTML={{ __html: highlightedText }}
        />
      </div>
      <div className="editButtons">
        <button onClick={saveEdit} className="saveEdit">
          Save
        </button>
        <button onClick={cancelEdit} className="cancelEdit">
          Cancel
        </button>
      </div>
    </div>
  );
};

const DeleteWindow: React.FC<DeleteWindowProps> = ({
  deleteNote,
  cancelDelete,
}) => {
  return (
    <div className="deleteModal">
      <p>Are you sure you want to delete this note?</p>
      <div className="answerButtons">
        <button className="yesButton" onClick={deleteNote}>
          Yes
        </button>
        <button className="noButton" onClick={cancelDelete}>
          No
        </button>
      </div>
    </div>
  );
};
