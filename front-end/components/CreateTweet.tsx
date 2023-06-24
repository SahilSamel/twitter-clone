import { useState, useEffect, useRef, ChangeEvent } from "react";
import ProfileImage from "./ProfileImage";
import { GoFileMedia } from "react-icons/go";
import { GrEmoji } from "react-icons/gr";
import { MdOutlineGifBox } from "react-icons/md";
import { AiOutlineCloseCircle } from "react-icons/ai";
import APIPOST from "@/api/POST/APIPOST";
import { useSelector } from "react-redux";
useSelector
interface ImagePreview {
  id: string;
  url: string;
}

const CreateTweet: React.FC = () => {

  const [text, setText] = useState("");
  const [imagePreviews, setImagePreviews] = useState<ImagePreview[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newPreviews: ImagePreview[] = Array.from(files).map((file) => {
        const id = String(Date.now()); // Generate a unique ID for each image
        const url = URL.createObjectURL(file);
        return { id, url };
      });
      setImagePreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
      event.target.value = ""; // Reset the value of the file input
    }
  };

  const removeImagePreview = (id: string) => {
    setImagePreviews((prevPreviews) =>
      prevPreviews.filter((preview) => preview.id !== id)
    );
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [text]);

  const token = useSelector((state: any) => state.auth.token);
  const onSubmit = () => {
    APIPOST("/compose/tweet",token,{
        type:0,
        text:text
    },
    function(err:any,data:any){
        if(err){
            console.log(err)
        }else{
            setText("");
            setImagePreviews([]);
        }
    })
  };

  return (
    <div>
      <div className="border-x border-b border-slate-600 p-3 font-semibold text-2xl">
        Home
      </div>
      <div className="border-x border-slate-600 p-3 flex">
        <div>
          <ProfileImage width={40} height={40} className="rounded-full" />
        </div>
        <div className="w-full flex flex-col">
          <textarea
            ref={textareaRef}
            placeholder="What is happening?!"
            className="bg-black text-xl text-white px-4 w-full placeholder:text-xl outline-none resize-none border-b border-slate-600 overflow-hidden"
            value={text}
            onChange={handleTextChange}
            maxLength={280}
          />
          <div className="image-container p-2 grid grid-cols-2 gap-4">
            {imagePreviews.map((preview) => (
              <div
                key={preview.id}
                className="image-wrapper flex flex-col items-end "
              >
                <AiOutlineCloseCircle
                  onClick={() => removeImagePreview(preview.id)}
                  className="remove-image text-4xl hover:cursor-pointer relative top-10 text-neutral-500	 "
                />
                <img
                  src={preview.url}
                  alt="Uploaded Image"
                  className="w-full h-auto"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="border-b border-x border-slate-600 flex px-5 pb-2">
        <div className="flex ml-8 space-x-4">
          <label htmlFor="imageUpload" className="cursor-pointer">
            <GoFileMedia className="text-xl text-sky-400" />
            <input
              id="imageUpload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              ref={fileInputRef}
              className="hidden"
            />
          </label>
          <GrEmoji className="text-xl text-sky-400" />
          <MdOutlineGifBox className="text-xl text-sky-400" />
        </div>
        <button
          className="text-base font-bold px-4 bg-sky-500 py-2 rounded-full ml-auto disabled:brightness-50"
          disabled={!text && imagePreviews.length === 0}
          onClick={()=>{onSubmit()}}
        >
          Tweet
        </button>
      </div>
    </div>
  );
};
export default CreateTweet;
