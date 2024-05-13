import React from "react";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
export default function SideCard({ element }) {
  const navig = useNavigate();
  return (
    <Card className="bg-gray-200 dark:bg-gray-900 h-[150px] border-none shadow-none">
      <div className="flex w-full bg-cover h-[80px] border-x-8 border-t-8 rounded-lg dark:border-gray-900">
        <img
          src={element.cover === ""?"/Combg.png":element.cover}
          className="object-cover w-full rounded-lg"
          alt="hello"
        />
      </div>
      <CardContent className="flex p-2 items-center gap-2 justify-between">
        <div className="flex items-center gap-2">
          <Avatar className=" bg-gray-900 h-14 w-14 border-2">
            <AvatarImage src={element.avatar === ""?"/klogo.png":element.avatar} alt="PFP" />
            <AvatarFallback className="Dark:bg-white text-orange-600 font-bold">k/</AvatarFallback>
          </Avatar>
          <p className="max-w-[125px] truncate font-bold">k/{element.communityName}</p>
        </div>
        <Button className=" text-black dark:text-white bg-tranperant shadow-none rounded-md py-1" onClick={()=>{navig(`/community/${element._id}`)}}>
          visit
        </Button>
      </CardContent>
    </Card>
  );
}
