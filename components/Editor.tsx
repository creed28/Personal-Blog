'use client'

import { BlockNoteEditor } from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import {
  BlockNoteView,
  useCreateBlockNote
} from "@blocknote/react";
import "@blocknote/react/style.css";
import { useTheme } from "next-themes";

async function uploadFile(file: File) {
  const body = new FormData();
  body.append("file", file);
 
  const ret = await fetch("https://tmpfiles.org/api/v1/upload", {
    method: "POST",
    body: body,
  });
  return (await ret.json()).data.url.replace(
    "tmpfiles.org/",
    "tmpfiles.org/dl/"
  );
}

type CombinedColor = Partial<{
  text: string;
  background: string;
}>
 
type ColorScheme = Partial<{
  editor: CombinedColor;
  menu: CombinedColor;
  tooltip: CombinedColor;
  hovered: CombinedColor;
  selected: CombinedColor;
  disabled: CombinedColor;
  shadow: string;
  border: string;
  sideMenu: string;
  highlights: Partial<{
    gray: CombinedColor;
    brown: CombinedColor;
    red: CombinedColor;
    orange: CombinedColor;
    yellow: CombinedColor;
    green: CombinedColor;
    blue: CombinedColor;
    purple: CombinedColor;
    pink: CombinedColor;
  }>;
}>
 
type Theme = Partial<{
  colors: ColorScheme;
  borderRadius: number;
  fontFamily: string;
}>

const Editor = () => {
  const { resolvedTheme } = useTheme();

  const editor: BlockNoteEditor = useCreateBlockNote({
    initialContent: [
      {
        type: "heading", 
        content: "Untitled",
      }
    ],
    uploadFile,
  });

  const lightTheme = {
    colors: {
      editor: {
        background: "#F0E7DB",
      }
    }
  } as Theme;

  const darkTheme = {
    colors: {
      editor: {
        background: "#202023",
      }
    }
  } as Theme;

  const theme = resolvedTheme === 'dark' ? darkTheme : lightTheme;

  return (
    <BlockNoteView 
      editor={editor} 
      theme={theme} 
    />
  )
}

export default Editor;
