import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardTitle } from "../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Postcard } from "@/components/Postcard";
import axios from "axios";
import { serverlink } from "@/link";
export default function UserProfile() {
  const navig = useNavigate();
  const params = useParams();
  const [about, setAbout] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [admin, setAdmin] = useState("");
  const [postLoad, setPostLoad] = useState(false);
  const [posts, setPosts] = useState([]);
  const getUserDetails = async () => {
    try {
      setLoading(true);
      const response = await axios(
        `${serverlink}/user/getUserProfile/${params.id}`
      );
      setAbout(response.data);
      setAdmin(response.data.admin);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError("an error occured");
      console.log(error.response.message);
    }
  };
  useEffect(() => {
    getUserDetails();
    getCommunityPosts();
  }, []);
  const getCommunityPosts = async () => {
    try {
      setPostLoad(true);
      const response1 = await axios(
        `${serverlink}/post/getUserPosts/${params.id}`
      );
      setPosts(response1.data);
      setPostLoad(false);
    } catch (error) {
      console.log(error.response.data);
      setPostLoad(false);
    }
  };
  return (
    <>
      {loading && (
        <div className="h-screen text-2xl flex items-center justify-center">
          Loading...
        </div>
      )}
      {!loading && (
        <div className="flex flex-col items-center xl:border-0 border-x-8 border-col border-transparent pt-4 px-2 ">
          <div>
            <Card className=" h-[250px] border-none shadow-none">
              <div className="flex w-full bg-cover h-[150px] border-x-8 border-t-8 rounded-lg border-transparent">
                <img
                  src={about.cover === "" ? "/Combg.png" : about.cover}
                  className="object-cover w-full rounded-lg"
                  alt="hello"
                />
              </div>
              <CardContent className="flex p-2 items-center gap-2 justify-between mt-5">
                <div className="flex items-center gap-2">
                  <Avatar className=" bg-gray-900 h-14 w-14 border-2">
                    <AvatarImage
                      src={about.avatar}
                      alt="PFP"
                    />
                    <AvatarFallback className="Dark:bg-white text-orange-600 font-bold">
                      u/
                    </AvatarFallback>
                  </Avatar>
                  <p className="max-w-[125px] truncate font-bold">
                    u/{about.username}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          <Tabs defaultValue="password" className="w-full">
            <TabsList className="bg-transparent">
              <TabsTrigger
                value="account"
                className="data-[state=active]:shadow-none"
              >
                Posts
              </TabsTrigger>
              <TabsTrigger
                value="password"
                className="data-[state=active]:shadow-none"
              >
                About
              </TabsTrigger>
            </TabsList>
            <TabsContent value="account" className="flex flex-col items-center">
              {
                postLoad && <div>
                  loading...
                </div>
              }
              {
                posts.length===0 && <p className="font-bold">This User has no posts</p>
              }
              {!postLoad && <div className="flex flex-col items-center xl:border-0 border-x-8 border-col border-transparent w-full">
                <div className="w-full">
                  {posts.map((element) => {
                    return <Postcard key={element._id} Post={element} />;
                  })}
                </div>
              </div>}
            </TabsContent>
            <TabsContent value="password">
              <Card>
                <CardContent className="mt-4">
                  <CardTitle className="my-2">About</CardTitle>
                  <p>{about.about}</p>
                </CardContent>
                <CardContent>
                  <CardTitle className="my-2">Links</CardTitle>
                  <div>
                    {about.userLinks &&
                      about.userLinks &&
                      about.userLinks.length !== 0 &&
                      about.userLinks.map((element, index) => {
                        return (
                          <div className="flex flex-row" key={index}>
                            <a
                              href={element.Link}
                              target="_blank"
                              className="w-[270px] truncate hover:underline"
                            >
                              {element.Name}
                            </a>
                          </div>
                        );
                      })}
                    {about.userLinks && about.userLinks.length === 0 && (
                      <p>This User Has No Links</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </>
  );
}
