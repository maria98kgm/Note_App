import "./App.css";
import { ChangeEvent, useEffect, useState } from "react";
// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
import uniqid from "uniqid";
import { Note } from "./components/Note";

const notesStorage = "notes";

export interface TagItem {
  tagName: string;
  id: string;
}

interface NoteItem {
  title: string;
  formattedTitle: string;
  tags: TagItem[];
  id: string;
}

function App() {
  const [input, setInput] = useState<string>("");
  const [notes, setNotes] = useState<NoteItem[]>([]);

  const addNoteHandler = () => {
    const allNotesStr: string | null = localStorage.getItem(notesStorage);
    const allNotes: NoteItem[] = allNotesStr ? JSON.parse(allNotesStr) : [];

    const regex: RegExp = /#\w+/gi;
    const tags: string[] | null = input.match(regex);
    const labledTags: TagItem[] | undefined = tags?.map((item) => ({
      tagName: item,
      id: uniqid(),
    }));

    const formattedTitle = input.replaceAll("#", "");

    allNotes.push({
      title: input,
      formattedTitle: formattedTitle,
      tags: labledTags ?? [],
      id: uniqid(),
    });
    setNotes(allNotes);
    localStorage.setItem(notesStorage, JSON.stringify(allNotes));
  };

  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  useEffect(() => {
    const allNotesStr: string | null = localStorage.getItem(notesStorage);
    if (allNotesStr) setNotes(JSON.parse(allNotesStr));
  }, []);

  return (
    <div className="App">
      <input type="text" name="note" onChange={handleInput} value={input} />
      <button onClick={addNoteHandler}>Add</button>
      {notes.map((item) => {
        return (
          <Note
            key={item.id}
            title={item.title}
            formattedTitle={item.formattedTitle}
            tags={item.tags}
            id={item.id}
          />
        );
      })}
    </div>
  );
}

export default App;
