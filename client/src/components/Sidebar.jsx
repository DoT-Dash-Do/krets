import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { House, Fire, PlusSquare } from "@phosphor-icons/react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { serverlink } from "@/link";
export default function Sidebar() {
  const navig = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [result, setResult] = useState([]);
  const getCommunityData = async () => {
    try {
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
    } catch (error) {
      console.log(error.response.data.message);
    }
  };
  useEffect(() => {
    getCommunityData();
  }, []);
  return (
    <div className="flex-col flex items-center w-[300px] border-r h-full overflow-auto bg-white dark:bg-black">
      <div className="flex flex-col border-b w-11/12 py-2">
        {currentUser && (
          <Link
            to="/home"
            className="flex items-start w-full gap-2 p-2 hover:bg-gray-700 rounded-lg"
          >
            <House size={24} />
            <p>Home</p>
          </Link>
        )}
        <Link
          to="/"
          className="flex items-start w-full gap-2 p-2 hover:bg-gray-700 rounded-lg"
        >
          <Fire size={24} />
          Popular
        </Link>
      </div>
      {currentUser && (
        <div className="flex flex-col border-b w-11/12 py-2">
          <Link
            to="/create-community"
            className="flex items-start w-full gap-2 p-2 hover:bg-gray-700 rounded-lg"
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
                className="flex items-center gap-2 hover:bg-gray-700 p-1 rounded-lg cursor-pointer select-none"
                key={index}
                onClick={() => {navig(`/community/${element._id}`)}}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={element.avatar === "" ? "/Combg.png" : element.avatar}
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <p className="text-sm">k/{element.communityName}</p>
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
                className="flex items-center gap-2 hover:bg-gray-700 p-1 rounded-lg cursor-pointer select-none"
                key={index}
                onClick={() => {navig(`/community/${element.community._id}`)}}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={element.community.avatar === "" ? "/klogo.png" : element.community.avatar}
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <p className="text-sm">k/{element.community.communityName}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
