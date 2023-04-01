import { ChangeEvent, useEffect, useState } from "react";
// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
import uniqid from "uniqid";
import "./App.css";

const notesStorage = "notes";

interface NoteItem {
  title: string;
  tags: string[];
  id: string;
}

function App() {
  const [input, setInput] = useState<string>("");
  const [notes, setNotes] = useState<NoteItem[]>([]);

  const addNoteHandler = () => {
    const allNotesStr: string | null = localStorage.getItem(notesStorage);
    const allNotes: NoteItem[] = allNotesStr ? JSON.parse(allNotesStr) : [];

    const regex = /#\w+/gi;
    const tags: string[] | null = input.match(regex);

    allNotes.push({ title: input, tags: tags ?? [], id: uniqid() });
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
          <div key={item.id}>
            <p>{item.title}</p>
          </div>
        );
      })}
    </div>
  );
}

export default App;
