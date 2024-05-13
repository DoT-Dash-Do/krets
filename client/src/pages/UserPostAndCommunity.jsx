import React, { useEffect, useState, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { serverlink } from "@/link";
import { Card, CardContent } from "../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Postcard } from "@/components/Postcard";
import { Trash } from "@phosphor-icons/react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function UserPostAndCommunity() {
  const params = useParams();
  const buttonRef = useRef(null);
  const navig = useNavigate();
  const [loading, setLoading] = useState(false);
  const [postLoad, setPostLoad] = useState(false);
  const [posts, setPosts] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [message, setMessage] = useState("");
  useEffect(() => {
    getCommunityPosts();
    getUserCommunities();
  }, []);

  const getUserCommunities = async () => {
    const token = window.localStorage.getItem("token");
    if(!token)
      {
        navig("/login");
      }
    try {
      setLoading(true);
      const response = await axios.post(
        `${serverlink}/community/getUserCommunities`,
        { token }
      );
      setCommunities(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setMessage(error.response.data.message);
      buttonRef.current.click();
    }
  };

  const getCommunityPosts = async () => {
    try {
      setPostLoad(true);
      const response1 = await axios(
        `${serverlink}/post/getUserPosts/${params.id}`
      );
      setPosts(response1.data);
      setPostLoad(false);
    } catch (error) {
      if (error.response) {
        console.log(error.response.data);
      }
      setPostLoad(false);
    }
  };
  const deletePost = async (postid) => {
    const token = window.localStorage.getItem("token");
    try {
      const response = await axios.post(`${serverlink}/post/deleteUserPost`, {
        token,
        postid,
      });
      getCommunityPosts();
      setMessage(response.data.message);
      buttonRef.current.click();
    } catch (error) {
      setMessage(error.response.data.message);
      buttonRef.current.click();
    }
  };
  return (
    <div className="mt-4">
      {loading && <div>loading...</div>}
      {!loading && (
        <Tabs defaultValue="Posts" className="w-full mb-2">
          <TabsList className="bg-transparent w-full">
            <TabsTrigger
              value="Posts"
              className="data-[state=active]:shadow-none "
            >
              Your Posts
            </TabsTrigger>
            <TabsTrigger
              value="Communities"
              className="data-[state=active]:shadow-none "
            >
              Your Communities
            </TabsTrigger>
          </TabsList>
          <TabsContent value="Posts">
            {!postLoad && (
              <div className="flex flex-col items-center xl:border-0 border-x-8 border-col border-transparent">
                <div className="w-full">
                  {posts.map((element) => {
                    return (
                      <div className="relative flex flex-col items-center">
                        <Postcard key={element._id} Post={element} />
                        <Button
                          className="absolute top-8 right-4 p-1 w-10"
                          onClick={() => {
                            deletePost(element._id);
                          }}
                        >
                          <Trash size={22} />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </TabsContent>
          <TabsContent
            value="Communities"
            className="px-2 flex flex-col items-center gap-2"
          >
            {communities.length > 0 &&
              communities.map((element) => {
                return (
                  <Card className="bg-gray-200 dark:bg-gray-900 h-[150px] border-none shadow-none">
                    <div className="flex w-full bg-cover h-[80px] border-x-8 border-t-8 rounded-lg dark:border-gray-900">
                      <img
                        src={element.cover || "/Combg.png"}
                        className="object-cover w-full rounded-lg"
                        alt="hello"
                      />
                    </div>
                    <CardContent className="flex p-2 items-center gap-2 justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className=" bg-gray-900 h-14 w-14 border-2" onClick={()=>{navig(`/community/${element._id}`)}}>
                          <AvatarImage
                            src={element.Avatar || "/klogo.png"}
                            alt="PFP"
                          />
                          <AvatarFallback className="Dark:bg-white text-orange-600 font-bold">
                            k/
                          </AvatarFallback>
                        </Avatar>
                        <p className="max-w-[125px] truncate font-bold">
                          k/{element.communityName}
                        </p>
                      </div>
                      <Button className=" text-black dark:text-white bg-tranperant shadow-none rounded-md py-1" onClick={()=>{navig(`/edit-community/${element._id}`)}}>
                        edit
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            {communities.length === 0 && (
              <p>Looks like you have no Communities</p>
            )}
          </TabsContent>
        </Tabs>
      )}
      <Dialog>
        <DialogTrigger className="hidden" ref={buttonRef}>
          Open
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{message}</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
