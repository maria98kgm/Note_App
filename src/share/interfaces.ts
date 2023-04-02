import { ChangeEvent } from "react";

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

export interface NoteProps {
  noteInfo: NoteItem;
  changeNotesHandler: (val: NoteItem[]) => void;
}

export interface InputFieldProps {
  changeNotesHandler: (val: NoteItem[]) => void;
  inputType: "createNote" | "filterNotes";
}

export interface ModalWindowProps {
  noteInfo: NoteItem;
  changeNotesHandler: (val: NoteItem[]) => void;
  modalType: string | null;
  changeModalType: (type: string | null) => void;
}

export interface ViewWindowProps {
  noteInfo: NoteItem;
  closeModal: () => void;
}

export interface EditWindowProps {
  saveEdit: () => void;
  cancelEdit: () => void;
  input: string;
  inputHandler: (event: ChangeEvent<HTMLTextAreaElement>) => void;
}

export interface DeleteWindowProps {
  deleteNote: () => void;
  cancelDelete: () => void;
}
