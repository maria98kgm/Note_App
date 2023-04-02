import React, { ChangeEvent, useState } from "react";
import "./style.scss";
import uniqid from "uniqid";
import { NoteItem, notesStorage, TagItem } from "../../App";

interface InputFieldProps {
  changeNotesHandler: (val: NoteItem[]) => void;
  inputType: "createNote" | "filterNotes";
}

export const InputField: React.FC<InputFieldProps> = ({
  changeNotesHandler,
  inputType,
}) => {
  const [input, setInput] = useState<string>("");

  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const addNoteHandler = () => {
    const allNotesStr: string | null = localStorage.getItem(notesStorage);
    const allNotes: NoteItem[] = allNotesStr ? JSON.parse(allNotesStr) : [];

    const regex: RegExp = /#\w+/gi;
    const tags: string[] | null = input.match(regex);
    const labledTags: TagItem[] | undefined = tags?.map((item) => ({
      name: item,
      id: uniqid(),
    }));

    const formattedTitle = input.replaceAll("#", "");

    allNotes.push({
      title: input,
      formattedTitle: formattedTitle,
      tags: labledTags ?? [],
      id: uniqid(),
    });
    changeNotesHandler(allNotes);
    localStorage.setItem(notesStorage, JSON.stringify(allNotes));
  };

  const filterNotes = () => {
    const allNotesStr: string | null = localStorage.getItem(notesStorage);
    const allNotes: NoteItem[] = allNotesStr ? JSON.parse(allNotesStr) : [];

    if (allNotes.length) {
      const filteredNotes: NoteItem[] = allNotes.filter((note) => {
        const filetrTags = input.split(" ");
        return note.tags.some((item) => filetrTags.includes(item.name));
      });

      changeNotesHandler(filteredNotes);
    }
  };

  return (
    <div className="createNoteBlock">
      <input
        type="text"
        name="note"
        onChange={handleInput}
        value={input}
        className="inputField"
      />

      <button
        onClick={inputType === "createNote" ? addNoteHandler : filterNotes}
        className="addButton"
      >
        {inputType === "createNote" ? "Add" : "Filter"}
      </button>
    </div>
  );
};
