import React from "react";
import { TagItem } from "../../App";

interface NoteProps {
  title: string;
  formattedTitle: string;
  tags: TagItem[];
  id: string;
}

export const Note: React.FC<NoteProps> = ({
  title,
  formattedTitle,
  tags,
  id,
}) => {
  return (
    <div>
      <h3>{formattedTitle}</h3>
      <div>
        {tags.map((item) => {
          return <p key={item.id}>{item.name}</p>;
        })}
      </div>
    </div>
  );
};
