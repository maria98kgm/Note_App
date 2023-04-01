import React, { ChangeEvent, useState } from "react";
import uniqid from "uniqid";
import { NoteItem, notesStorage, TagItem } from "../../App";

interface InputFieldProps {
  changeNotesHandler: (val: NoteItem[]) => void;
}

export const InputField: React.FC<InputFieldProps> = ({
  changeNotesHandler,
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

  return (
    <div>
      <input type="text" name="note" onChange={handleInput} value={input} />
      <button onClick={addNoteHandler}>Add</button>
    </div>
  );
};
