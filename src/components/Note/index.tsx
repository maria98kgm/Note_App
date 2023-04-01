import React, { ChangeEvent, useState } from "react";
import { NoteItem, TagItem, notesStorage } from "../../App";
import uniqid from "uniqid";

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

  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
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

  return (
    <div>
      {editing ? (
        <div className="editMode">
          <input type="text" onChange={handleInput} value={input} />
          <button onClick={saveNoteHandler}>Save</button>
          <button onClick={cancleEditHandler}>Cancel</button>
        </div>
      ) : (
        <div className="showMode">
          <h3>{formattedTitle}</h3>
          <button onClick={handleEditingMode}>Edit</button>
          <button onClick={deleteNoteHandler}>Delete</button>
        </div>
      )}
      <div>
        {tags.map((item) => {
          return <p key={item.id}>{item.name}</p>;
        })}
      </div>
    </div>
  );
};
