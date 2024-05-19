import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardTitle } from "../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Postcard } from "@/components/Postcard";
import { useSelector } from "react-redux";
import axios from "axios";
import { serverlink } from "@/link";
export default function Community() {
  const navig = useNavigate();
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const [about, setAbout] = useState("");
  const [follow, setFollow] = useState(false);
  const [fload, setfload] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [admin, setAdmin] = useState("");
  const [postLoad, setPostLoad] = useState(false);
  const [posts, setPosts] = useState([]);
  const getCommunityDetails = async () => {
    try {
      setLoading(true);
      const response = await axios(
        `${serverlink}/community/getCommunityDetails/${params.id}`
      );
      setAbout(response.data);
      setAdmin(response.data.admin);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError("an error occured");
      console.log(error);
    }
  };
  const followComm = async () => {
    const token = window.localStorage.getItem("token");
    try {
      setfload(true);
      const answer = await axios.post(`${serverlink}/user/follow`, {
        token,
        communityId: params.id,
      });
      setfload(false);
      setFollow(true);
    } catch (error) {
      console.log(error);
      setfload(false);
    }
  };

  const unfollowComm = async () => {
    const token = window.localStorage.getItem("token");
    try {
      setfload(true);
      const answer = await axios.post(`${serverlink}/user/unfollow`, {
        token,
        communityId: params.id,
      });
      setfload(false);
      setFollow(false);
    } catch (error) {
      console.log(error);
      setfload(false);
    }
  };

  const checkFollow = async () => {
    const token = window.localStorage.getItem("token");
    try {
      if (currentUser) {
        setfload(true);
        const answer = await axios.post(`${serverlink}/user/checkFollow`, {
          token,
          communityId: params.id,
        });
        if (!answer.data.check) {
          setFollow(false);
        } else {
          setFollow(true);
        }
        setfload(false);
      }
      else
      {
        return;
      }
    } catch (error) {
      console.log(error);
      setfload(false);
    }
  };

  useEffect(() => {
    getCommunityDetails();
    getCommunityPosts();
    checkFollow();
  }, [params]);
  const getCommunityPosts = async () => {
    try {
      setPostLoad(true);
      const response1 = await axios(
        `${serverlink}/post/getCommunityPosts/${params.id}`
      );
      setPosts(response1.data);
      setPostLoad(false);
    } catch (error) {
      console.log(error);
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
        <div className="flex flex-col items-center xl:border-0 border-x-8 border-col border-transparent pt-4 px-2 mb-2">
          <div>
            <Card className="w-full h-[250px] border-none shadow-none">
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
                      src={about.avatar === "" ? "/klogo.png" : about.avatar}
                      alt="PFP"
                    />
                    <AvatarFallback className="Dark:bg-white text-orange-600 font-bold">
                      k/
                    </AvatarFallback>
                  </Avatar>
                  <p className="max-w-[125px] truncate font-bold">
                    k/{about.communityName}
                  </p>
                </div>
                {currentUser && !follow && !fload && (
                  <Button
                    className=" text-black dark:text-white bg-tranperant shadow-none rounded-md py-1"
                    onClick={followComm}
                  >
                    follow
                  </Button>
                )}
                {currentUser && follow && !fload && (
                  <Button
                    className=" text-black dark:text-white bg-tranperant shadow-none rounded-md py-1"
                    onClick={unfollowComm}
                  >
                    unfollow
                  </Button>
                )}
                {fload && (
                  <Button
                    className=" text-black dark:text-white bg-tranperant shadow-none rounded-md py-1"
                    disabled
                  >
                    unfollow
                  </Button>
                )}
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
              {currentUser && (
                <Button
                  className="w-[95%]"
                  onClick={() => {
                    navig(`/create-post/${params.id}`);
                  }}
                >
                  Create Post
                </Button>
              )}
              {postLoad && <div>loading...</div>}
              {!postLoad && (
                <div className="flex flex-col items-center xl:border-0 border-x-8 border-col border-transparent w-full">
                  <div className="w-full">
                    {posts.map((element) => {
                      return <Postcard key={element._id} Post={element} />;
                    })}
                  </div>
                </div>
              )}
            </TabsContent>
            <TabsContent value="password">
              <Card>
                <CardContent className="mt-4 flex gap-2">
                  <CardTitle>{about.followers} followers</CardTitle>
                  <CardTitle>{about.posts} posts</CardTitle>
                </CardContent>
                <CardContent className="">
                  <CardTitle className="my-2">About</CardTitle>
                  <p>{about.about}</p>
                </CardContent>
                <CardContent className="">
                  <CardTitle className="my-2">Rules</CardTitle>
                  <div>
                    {about.rules &&
                      about.rules.length !== 0 &&
                      about.rules.map((element, index) => {
                        return (
                          <div className="truncate flex flex-row gap-1">
                            <p>{index + 1}.</p>
                            <p className="w-[250px] truncate">{element}</p>
                          </div>
                        );
                      })}
                    {about.rules && about.rules.length === 0 && (
                      <p>This Community Has No rules</p>
                    )}
                  </div>
                </CardContent>
                <CardContent>
                  <CardTitle className="my-2">Links</CardTitle>
                  <div>
                    {about.links &&
                      about.links &&
                      about.links.length !== 0 &&
                      about.links.map((element, index) => {
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
                    {about.links && about.links.length === 0 && (
                      <p>This Community Has No links</p>
                    )}
                  </div>
                </CardContent>
                <CardContent>
                  <CardTitle>Meet the creator</CardTitle>
                  <div
                    className="bg-gray-200 dark:bg-gray-900 max-w-[200px] rounded-lg p-2 flex items-center gap-2 mt-1"
                    onClick={() => {
                      navig(`/user/${admin._id}`);
                    }}
                  >
                    <Avatar className=" bg-gray-900 h-10 w-10 border-2">
                      <AvatarImage src={admin.avatar} alt="PFP" />
                      <AvatarFallback className="Dark:bg-white text-orange-600 font-bold">
                        u/
                      </AvatarFallback>
                    </Avatar>
                    <p className="text-xl font-bold">
                      {about.admin && about.admin.username}
                    </p>
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
