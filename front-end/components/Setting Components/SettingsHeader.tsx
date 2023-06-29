import { MdKeyboardBackspace } from "react-icons/md";
import { useRouter } from "next/router";

interface HeaderProps {
    title: string;
    subtitle:string;
  }
  


const SettingsHeader:React.FC<HeaderProps> = ({title,subtitle}) => {
    const router = useRouter();

    return (
        <header>
        <h1 className="text-xl font-semibold px-5 py-2 flex items-center">
          <MdKeyboardBackspace
            className="text-1xl hover:cursor-pointer mr-5"
            onClick={() => router.back()}
          />
          {title}
        </h1>
        <p className="text-xs p-3 text-gray-500 ">
          {subtitle}
        </p>
      </header>
    );
}

export default SettingsHeader;