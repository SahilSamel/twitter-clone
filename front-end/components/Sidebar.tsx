import React from 'react';
import { useDispatch } from 'react-redux';
import { clearToken } from '@/state/authStates';
import { useRouter } from 'next/router';
import {
  AiOutlineHome,
  AiOutlineUser,
  AiOutlineBell,
  AiOutlineBook,
  AiOutlineForm,
  AiOutlineSetting,
  AiOutlineLogout,
} from 'react-icons/ai';
import { useWindowSize } from '@/utils/Windowsize'; // Custom hook for getting window size

const Sidebar = () => {
  const { width } = useWindowSize(); // Get window width using custom hook
  const isMobile = width <= 768; // Define breakpoint for mobile screens
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(clearToken());
    router.push('/');
  };
  return (
    <div className="flex flex-col gap-2 justify-start items-start w-1/5 h-full p-6">
      <button
        className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
          isMobile ? 'text-xl' : 'text-lg'
        } hover:bg-blue-100 hover:text-blue-500`}
      >
        <AiOutlineHome />
        {!isMobile && <span>Home</span>}
      </button>
      <button
        className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
          isMobile ? 'text-xl' : 'text-lg'
        } hover:bg-blue-100 hover:text-blue-500`}
      >
        <AiOutlineUser />
        {!isMobile && <span>Profile</span>}
      </button>
      <button
        className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
          isMobile ? 'text-xl' : 'text-lg'
        } hover:bg-blue-100 hover:text-blue-500`}
      >
        <AiOutlineBell />
        {!isMobile && <span>Notifications</span>}
      </button>
      <button
        className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
          isMobile ? 'text-xl' : 'text-lg'
        } hover:bg-blue-100 hover:text-blue-500`}
      >
        <AiOutlineBook />
        {!isMobile && <span>Bookmark</span>}
      </button>
      <button
        className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
          isMobile ? 'text-xl' : 'text-lg'
        } hover:bg-blue-100 hover:text-blue-500`}
      >
        <AiOutlineForm />
        {!isMobile && <span>Tweet</span>}
      </button>
      <button
        className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
          isMobile ? 'text-xl' : 'text-lg'
        } hover:bg-blue-100 hover:text-blue-500`}
      >
        <AiOutlineSetting />
        {!isMobile && <span>Settings</span>}
      </button>
      <button
        className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
          isMobile ? 'text-xl' : 'text-lg'
        } hover:bg-blue-100 hover:text-blue-500`}
        onClick={handleLogout}
      >
        <AiOutlineLogout />
        {!isMobile && <span>Account (Logout)</span>}
      </button>
    </div>
  );
};

export default Sidebar;
