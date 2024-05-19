import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { House, Fire, PlusSquare, MagnifyingGlass, CurrencyEth } from "@phosphor-icons/react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { serverlink } from "@/link";
import { LogOut } from "lucide-react";
import { signOutStart,signOutSuccess } from "@/redux/user/userSlice";
export default function Sidebar() {
  const navig = useNavigate();
  const Dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [result, setResult] = useState([]);
  const[loading,setLoading] = useState(true);
  const getCommunityData = async () => {
    try {
      setLoading(true);
      if (!currentUser) {
        const response = await axios(
          `${serverlink}/community/getTenCommunities`
        );
        setResult(response.data);
      }
      else
      {
        const response = await axios(
          `${serverlink}/community/getUserFollows/${currentUser.rest._id}`
        );
        setResult(response.data);
      }
      setLoading(false)
    } catch (error) {
      console.log(error.response.data.message);
      setLoading(false);
    }
  };
  useEffect(() => {
    getCommunityData();
  }, []);
  useEffect(() => {
    getCommunityData();
  }, [currentUser]);
  const signOutMain = () => {
    try {
      Dispatch(signOutStart());
      window.localStorage.removeItem("token");
      Dispatch(signOutSuccess());
      navig("/login");
    } catch (error) {
      console.log(error);
    }
  };
  return (<>
    {loading && <div className="flex-col flex items-center w-[300px] border-r h-full overflow-auto bg-white dark:bg-black">...</div>}
    {!loading &&
    <div className="flex-col flex items-center w-[300px] border-r h-full overflow-auto bg-white dark:bg-black">
      <div className="flex flex-col border-b w-11/12 py-2">
        {currentUser && (
          <Link
            to="/home"
            className="flex items-start w-full gap-2 p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg"
          >
            <House size={24} />
            <p>Home</p>
          </Link>
        )}
        <Link
          to="/"
          className="flex items-start w-full gap-2 p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg"
        >
          <Fire size={24} />
          Popular
        </Link>
      </div>
      {currentUser && (
        <div className="flex flex-col border-b w-11/12 py-2">
          <Link
            to="/create-community"
            className="flex items-start w-full gap-2 p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg"
          >
            <PlusSquare size={24} />
            Create Community
          </Link>
        </div>
      )}
      {!currentUser && result.length > 0 && (
        <div className="flex flex-col border-b w-11/12 py-2 gap-2">
          {result.map((element, index) => {
            return (
              <div
                className="flex items-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-700 p-1 rounded-lg cursor-pointer select-none"
                key={index}
                onClick={() => {navig(`/community/${element?._id}`)}}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={element.avatar === "" ? "/Combg.png" : element.avatar}
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <p className="text-sm">k/{element?.communityName}</p>
              </div>
            );
          })}
        </div>
      )}
      {currentUser && result.length > 0 && (
        <div className="flex flex-col border-b w-11/12 py-2 gap-2">
          {result.map((element, index) => {
            return (
              <div
                className="flex items-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-700 p-1 rounded-lg cursor-pointer select-none"
                key={index}
                onClick={() => {navig(`/community/${element.community?._id}`)}}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={element?.community?.avatar === "" ? "/klogo.png" : element?.community?.avatar}
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <p className="text-sm">k/{element.community?.communityName}</p>
              </div>
            );
          })}
        </div>
      )}
      <div className="flex flex-col border-b w-11/12 py-2">
        <Link
          to="/search/Post/-"
          className="flex items-start w-full gap-2 p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg"
        >
          <MagnifyingGlass size={24} />
          search
        </Link>
        {currentUser && <button
          onClick={signOutMain}
          className="flex items-start w-full gap-2 p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg"
        >
          <LogOut size={24} />
          Logout
        </button>}
      </div>
    </div>}
    </>
  );
}
