import "./App.scss";
import { ChangeEvent, useEffect, useState } from "react";
// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
import { Note } from "./components/Note";
import { InputField } from "./components/InputField";
import { ModalWindow } from "./components/ModalWindow";

export const notesStorage = "notes";

export interface TagItem {
  name: string;
  id: string;
}

export interface NoteItem {
  title: string;
  formattedTitle: string;
  tags: TagItem[];
  id: string;
}

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
      {/* {modal ? <ModalWindow /> : null} */}
    </div>
  );
}

export default App;
