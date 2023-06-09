import React, { ChangeEvent, useState } from "react";
import "./style.scss";
import uniqid from "uniqid";
import { notesStorage, tagRegex } from "../../share/constants";
import { InputFieldProps, NoteItem, TagItem } from "../../share/interfaces";

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

    const tags: string[] = input.match(tagRegex) ?? [];
    const filtered: string[] = [...new Set(tags)];
    const labledTags: TagItem[] | undefined = filtered.map((item) => ({
      name: item,
      id: uniqid(),
    }));

    const formattedTitle = input.replaceAll("#", "");

    allNotes.unshift({
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

    if (!input.length) {
      changeNotesHandler(allNotes);
    } else if (allNotes.length) {
      const filteredNotes: NoteItem[] = allNotes.filter((note) => {
        const filetrTags = input.split(" ");
        return note.tags.some((item) => filetrTags.includes(item.name));
      });

      changeNotesHandler(filteredNotes);
    }
  };

  const shouldDisable = inputType === "createNote" ? input.length === 0 : false;

  return (
    <div className="createNoteBlock">
      <label className="inputLabel">
        <p className="labelText">
          {inputType === "createNote" ? "Create note" : "Filter by tag"}:
        </p>
        <input
          type="text"
          name="note"
          onChange={handleInput}
          value={input}
          placeholder={
            inputType === "createNote"
              ? "Enter note content..."
              : "Enter tag name, exmp. #tag-name..."
          }
          className="inputField"
        />
      </label>
      <button
        onClick={inputType === "createNote" ? addNoteHandler : filterNotes}
        disabled={shouldDisable}
        className="addButton"
      >
        {inputType === "createNote" ? "Add" : "Filter"}
      </button>
    </div>
  );
};
