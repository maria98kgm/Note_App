import React, { ChangeEvent, SyntheticEvent, useEffect, useState } from "react";
import "./style.scss";
import uniqid from "uniqid";
import {
  convertToHtml,
  notesStorage,
  removeDuplicates,
  tagRegex,
} from "../../share/constants";
import {
  ModalWindowProps,
  NoteItem,
  TagItem,
  ViewWindowProps,
  EditWindowProps,
  DeleteWindowProps,
  NewTagWindowProps,
} from "../../share/interfaces";

export const ModalWindow: React.FC<ModalWindowProps> = ({
  noteInfo,
  changeNotesHandler,
  modalType,
  changeModalType,
}) => {
  const [input, setInput] = useState(noteInfo.title);
  const [tagInput, setTagInput] = useState("");

  const inputHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
  };

  const tagInputHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setTagInput(event.target.value);
  };

  const saveEdit = () => {
    const allNotesStr: string = localStorage.getItem(notesStorage) as string;
    const allNotes: NoteItem[] = JSON.parse(allNotesStr);
    const noteIndex: number = allNotes.findIndex(
      (item) => item.id === noteInfo.id
    ) as number;

    const tags: string[] = input.match(tagRegex) ?? [];
    const oldTextTags: string[] =
      allNotes[noteIndex].title.match(tagRegex) ?? [];
    const newTags: TagItem[] = allNotes[noteIndex].tags;
    tags.map((item) => {
      newTags.unshift({
        name: item,
        id: uniqid(),
      });
    });
    const textTagsToRemove: string[] = oldTextTags.filter(
      (item) => !tags.includes(item)
    );
    const sortedTags: TagItem[] = newTags.filter(
      (item) => !textTagsToRemove.includes(item.name)
    );

    allNotes[noteIndex].title = input;
    allNotes[noteIndex].formattedTitle = input.replaceAll("#", "");
    allNotes[noteIndex].tags = removeDuplicates(sortedTags);

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

  const createNewTag = () => {
    const allNotesStr: string = localStorage.getItem(notesStorage) as string;
    const allNotes: NoteItem[] = JSON.parse(allNotesStr);
    const noteIndex: number = allNotes.findIndex(
      (item) => item.id === noteInfo.id
    ) as number;

    const newTags: TagItem[] = allNotes[noteIndex].tags;
    newTags.unshift({
      name: `#${tagInput.replace(/[\s.,!?`{}();#]/g, "")}`,
      id: uniqid(),
    });
    allNotes[noteIndex].tags = removeDuplicates(newTags);

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
        ) : modalType === "newTag" ? (
          <NewTagWindow
            saveTag={createNewTag}
            cancelCreate={closeModal}
            input={tagInput}
            inputHandler={tagInputHandler}
          />
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
  const shouldDisable = input.length === 0;

  return (
    <div className="editModal">
      <label htmlFor="editField" className="editLabel">
        Edit your note:
      </label>
      <div className="textEdit">
        <textarea
          value={input}
          onChange={inputHandler}
          onScroll={scrollHandler}
          id="editField"
          className="textareaField"
        />
        <div
          id="textareaHighlight"
          dangerouslySetInnerHTML={{ __html: highlightedText }}
        />
      </div>
      <div className="editButtons">
        <button
          onClick={saveEdit}
          disabled={shouldDisable}
          className="saveEdit"
        >
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

const NewTagWindow: React.FC<NewTagWindowProps> = ({
  saveTag,
  cancelCreate,
  input,
  inputHandler,
}) => {
  const shouldDisable = input.length === 0;

  return (
    <div className="newTagModal">
      <label htmlFor="tagField" className="tagLabel">
        Enter tag name:
      </label>
      <div className="tagInputContainer">
        <input
          value={input}
          onChange={inputHandler}
          placeholder="Enter tag name..."
          className="tagNameInput"
        />
      </div>
      <div className="tagButtons">
        <button onClick={saveTag} disabled={shouldDisable} className="saveTag">
          Save
        </button>
        <button onClick={cancelCreate} className="cancelTag">
          Cancel
        </button>
      </div>
    </div>
  );
};
