import React, { ChangeEvent, SyntheticEvent, useState } from "react";
import "./style.scss";
import uniqid from "uniqid";
import { NoteItem, TagItem, notesStorage } from "../../App";
import editIcon from "../../assets/pencil.svg";
import deleteIcon from "../../assets/trash.svg";
import loupeIcon from "../../assets/loupe.svg";

interface NoteProps {
  title: string;
  formattedTitle: string;
  tags: TagItem[];
  id: string;
  changeNotesHandler: (val: NoteItem[]) => void;
}

export const Note: React.FC<NoteProps> = ({
  title,
  formattedTitle,
  tags,
  id,
  changeNotesHandler,
}) => {
  const [editing, setEditing] = useState(false);
  const [input, setInput] = useState(title);

  const handleInput = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
  };

  const handleEditingMode = () => {
    setEditing(true);
  };

  const saveNoteHandler = () => {
    const allNotesStr: string = localStorage.getItem(notesStorage) as string;
    const allNotes: NoteItem[] = JSON.parse(allNotesStr);
    const noteIndex: number = allNotes.findIndex(
      (item) => item.id === id
    ) as number;

    const regex: RegExp = /#\w+/gi;
    const tags: string[] | null = input.match(regex);
    const labledTags: TagItem[] | undefined = tags?.map((item) => ({
      name: item,
      id: uniqid(),
    }));

    allNotes[noteIndex].title = input;
    allNotes[noteIndex].formattedTitle = input.replaceAll("#", "");
    if (labledTags) allNotes[noteIndex].tags = labledTags;

    changeNotesHandler(allNotes);
    localStorage.setItem(notesStorage, JSON.stringify(allNotes));
    setEditing(false);
  };

  const cancleEditHandler = () => {
    setEditing(false);
  };

  const deleteNoteHandler = () => {
    const allNotesStr: string = localStorage.getItem(notesStorage) as string;
    const allNotes: NoteItem[] = JSON.parse(allNotesStr);
    const noteIndex: number = allNotes.findIndex(
      (item) => item.id === id
    ) as number;

    allNotes.splice(noteIndex, 1);
    changeNotesHandler(allNotes);
    localStorage.setItem(notesStorage, JSON.stringify(allNotes));
  };

  const handleScroll = (event: SyntheticEvent<HTMLTextAreaElement>) => {
    document
      .getElementById("editText")
      ?.scroll(event.currentTarget.scrollLeft, event.currentTarget.scrollTop);
  };

  return (
    <div className="note">
      <div className="showMode">
        <h3 className="noteTitle">{formattedTitle}</h3>
        <div className="effectButtons">
          <button className="expandButton">
            <img src={loupeIcon} className="logo" alt="expand" />
          </button>
          <button onClick={handleEditingMode} className="editButton">
            <img src={editIcon} className="logo" alt="edit" />
          </button>
          <button onClick={deleteNoteHandler} className="deleteButton">
            <img src={deleteIcon} className="logo" alt="delete" />
          </button>
        </div>
      </div>
      <div className="tags">
        {tags.map((item) => {
          return (
            <p key={item.id} className="tagBlock">
              {item.name}
            </p>
          );
        })}
      </div>
    </div>
  );
};

{
  /* <div className="editMode">
<div className="text">
  <textarea
    value={input}
    onChange={handleInput}
    onScroll={handleScroll}
  />
  <div id="editText">{input}</div>
</div>
<button onClick={saveNoteHandler}>Save</button>
<button onClick={cancleEditHandler}>Cancel</button>
</div> */
}
