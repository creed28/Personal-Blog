'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from './Dialog';
import { useCoverImage } from '../hooks/useCoverImage';
import { SingleImageDropzone } from './SingleImageDropzone';
import { useState } from 'react';
import { useEdgeStore } from '../lib/edgestore';

export const CoverImageDialog = () => {
  const [file, setFile] = useState<File>();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { edgestore } = useEdgeStore();
  const coverImage = useCoverImage();

  const onClose = () => {
    setFile(undefined);
    setIsSubmitting(false);
    coverImage.onClose();
  }

  const onChange = async (file?: File) => {
    if(file) {
      setIsSubmitting(true);
      setFile(file);

      await edgestore.publicFiles.upload({file});

      onClose();
    }
  }

  return (
    <Dialog open={coverImage.isOpen} onOpenChange={coverImage.onClose}>
      <DialogContent className='bg-[#F0E7DB] dark:bg-[#202023]'>
        <DialogHeader>
          <DialogTitle className='text-center text-lg font-semibold'>
            Cover Image
          </DialogTitle>
        </DialogHeader>
        <SingleImageDropzone 
          className='w-full outline-none' 
          disabled={isSubmitting} 
          value={file} 
          onChange={onChange}
        />
      </DialogContent>
    </Dialog>
  )
}
