export const notesStorage = "notes";
export const tagRegex: RegExp = /#\w+/gi;
export const convertToHtml = (arr: string[]): string => {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === "#" && arr[i + 1] !== " " && arr[i - 1] !== ">") {
      for (let f = i; f < arr.length; f++) {
        if (arr[f] === " " || /[.,!?`{}();]/.test(arr[f])) {
          arr.splice(f, 0, "</span>");
          break;
        } else if (f === arr.length - 1) {
          arr.splice(f + 1, 0, "</span>");
          break;
        }
      }

      arr.splice(i, 0, '<span class="tagHighlight">');
      i++;
    }
  }

  return arr.join("");
};
