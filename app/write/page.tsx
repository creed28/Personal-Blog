'use client'

/* import Cover from "../../components/Cover"; */
import { Button } from "../../components/Button";
import { useCoverImage } from "../../hooks/useCoverImage";

import dynamic from "next/dynamic";
const Editor = dynamic(() => import("../../components/Editor"), { ssr: false });

const WritePage = () => {
  const coverImage = useCoverImage();
  /* const url = 'https://files.edgestore.dev/7dizm6lrec3fj108/publicFiles/_public/'; */

  return (
    <section>
      <Button onClick={coverImage.onOpen}>
        Add cover
      </Button>
      <Editor />
    </section>
  )
}

export default WritePage
