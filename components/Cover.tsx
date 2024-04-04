import { cn } from "../lib/utils";
import Image from "next/image";
import { Button } from "./Button";
import { useCoverImage } from "../hooks/useCoverImage";

type CoverProps = {
  url?: string;
}

const Cover = ({ url }: CoverProps) => {
  const coverImage = useCoverImage();
  return (
    <div className={cn(
      "relative w-full h-[35vh] group",
      !url && "h-[12vh]",
      url && "bg-muted"
    )}>
      {!!url && (
        <Image src={url} fill alt="Cover" className="object-cover" />
      )}
      {url && (
        <div className="opacity-0 group-hover:opacity-100 absolute bottom-5 right-5 flex items-center gap-x-2">
          <Button 
            onClick={coverImage.onOpen} className="text-muted-foreground text-xs"
            size="sm"
            >
              Change cover
          </Button>
          <Button
            onClick={() => {}} className="text-muted-foreground text-xs"
            size="sm"
          >
            Remove
          </Button>
        </div>
      )}
    </div>
  )
}

export default Cover
