import "./App.scss";
import { useEffect, useState } from "react";
import { Note } from "./components/Note";
import { InputField } from "./components/InputField";
import { notesStorage } from "./share/constants";
import { NoteItem } from "./share/interfaces";

function App() {
  const [notes, setNotes] = useState<NoteItem[]>([]);

  const changeNotesHandler = (val: NoteItem[]) => {
    setNotes(val);
  };

  useEffect(() => {
    const allNotesStr: string | null = localStorage.getItem(notesStorage);
    if (allNotesStr) setNotes(JSON.parse(allNotesStr));
  }, []);

  return (
    <div className="App">
      <InputField
        changeNotesHandler={changeNotesHandler}
        inputType="createNote"
      />
      <InputField
        changeNotesHandler={changeNotesHandler}
        inputType="filterNotes"
      />
      <div className="notesBlock">
        {notes.map((item) => {
          return (
            <Note
              key={item.id}
              noteInfo={item}
              changeNotesHandler={changeNotesHandler}
            />
          );
        })}
      </div>
    </div>
  );
}

export default App;
