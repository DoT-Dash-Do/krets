import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ModeToggle } from "@/themes/ModeToggle";
import { Button } from "./ui/button";
import {
  PlugsConnected,
  MagnifyingGlass,
  SignOut,
  List,
  X
} from "@phosphor-icons/react";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import {
  signOutStart,
  signOutSuccess,
} from "@/redux/user/userSlice";
import Sidebar from "./Sidebar";
export default function Navbar() {
  const navig = useNavigate();
  const Dispatch = useDispatch();
  const [menu, setMenu] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const forwardToLogin = () => {
    navig("/login");
  };
  const signOutMain = () => {
    try {
      Dispatch(signOutStart());
      window.localStorage.removeItem("token");
      Dispatch(signOutSuccess());
      navig("/");
    } catch (error) {
      console.log(error);
    }
  };
  const forwardToUpdateProfile = () => {
    navig("/update-user");
  };
  const showMenu = () => {
    setMenu(!menu);
  };
  return (
    <div className="flex flex-col">
      <div className="bg-white dark:bg-black w-screen border-b border-slate-200 dark:border-[#1f1f1f] p-2 px-4 flex justify-between items-center">
        <div className="flex items-center gap-2 text-2xl font-bold text-orange-600">
          {!menu && (
            <button
              className="lg:hidden"
              onClick={() => {
                showMenu();
              }}
            >
              <List className="dark:text-white text-black" size={32} />
            </button>
          )}
          {menu && (
            <button
              className="lg:hidden"
              onClick={() => {
                showMenu();
              }}
            >
              <X className="dark:text-white text-black" size={32} />
            </button>
          )}
          <PlugsConnected />
          <p>krets</p>
        </div>
        <div className="md:flex w-full hidden max-w-[400px] items-center border rounded-lg">
          <Input type="text" placeholder="Search" className="border-none" />
          <Button type="submit" variant="primary">
            <MagnifyingGlass size={20} />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          {!currentUser && (
            <Button
              onClick={() => {
                forwardToLogin();
              }}
            >
              Sign-in
            </Button>
          )}
          {currentUser && (
            <>
              <Avatar className="h-8 w-8 cursor-pointer select-none" onClick={forwardToUpdateProfile}>
                <AvatarImage src={currentUser.rest.avatar} alt="PFP" />
                <AvatarFallback className="Dark:bg-white text-orange-600 font-bold">
                  u/
                </AvatarFallback>
              </Avatar>
              <button
                title="logout"
                className="hover:bg-slate-600 p-1 rounded-lg"
              >
                <SignOut size={25} onClick={signOutMain} />
              </button>
            </>
          )}
          <ModeToggle />
        </div>
      </div>
        <div className={`lg:hidden fixed inset-y-0 top-14 left-0 z-10 transform w-screen ${
          menu ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-500 ease-in-out`}>
          <Sidebar />
      </div>    
    </div>
  );
}
