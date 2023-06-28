import { MdKeyboardBackspace } from "react-icons/md";
import { useRouter } from 'next/router'

interface ProfileHeaderProps {
  userName: string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ userName }) => {
  const router = useRouter();
  
  return (
    <div className="flex flex-row pl-5 bg">
      <div className="flex items-center">
        <MdKeyboardBackspace className="text-3xl hover:cursor-pointer" onClick={() => router.back()} />
      </div>

      <div className="pl-10 p-2">
        <div className="font-bold text-xl">{userName}</div>
      </div>
    </div>
  );
};

export default ProfileHeader;

