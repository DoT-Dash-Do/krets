import React from "react";
import { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  PlugsConnected,
  ChatCentered,
  ShareFat,
  Plugs,
} from "@phosphor-icons/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate, Link, useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { serverlink } from "@/link";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
export const SinglePost = () => {
  const navig = useNavigate();
  const params = useParams();
  const [Post, setPost] = useState();
  const [Comments, setComments] = useState();
  const [like, setLike] = useState(false);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [load, setLoad] = useState(false);
  const postComment = async () => {
    const token = window.localStorage.getItem("token");
    if(!comment.trim())
      {
        return;
      }
    try {
      setLoad(true);
      await axios.post(`${serverlink}/post/postComment`, {
        token,
        postId: params.id,
        comment: comment,
      });
      const response = await axios(
        `${serverlink}/post/getComments/${params.id}`
      );
      setComments(response.data);
      setLoad(false);
    } catch (error) {
      setLoad(false);
    }
  };
  const likePost = async () => {
    const token = window.localStorage.getItem("token");
    try {
      setLoad(true);
      const response = await axios.post(`${serverlink}/post/likePost`, {
        token,
        postId: params.id,
      });
      setLike(true);
      setLoad(false);
    } catch (error) {
      setLoad(false);
    }
  };
  const unlikePost = async () => {
    const token = window.localStorage.getItem("token");
    try {
      setLoad(true);
      await axios.post(`${serverlink}/post/dislikePost`, {
        token,
        postId: params.id,
      });
      setLike(false);
      setLoad(false);
    } catch (error) {
      setLoad(false);
    }
  };
  const getPostDetails = async () => {
    const token = window.localStorage.getItem("token");
    if (!token) return navig("/login");
    try {
      setLoading(true);
      const response = await axios.post(`${serverlink}/post/getSinglePost`, {
        token,
        postId: params.id,
      });
      setPost(response.data.post);
      setComments(response.data.comments);
      if (response.data.likedByUser.length !== 0) {
        setLike(true);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };
  useEffect(() => {
    getPostDetails();
  }, []);
  return (
    <>
      {loading && (
        <div className="flex justify-center min-h-full items-center text-2xl">
          loading...
        </div>
      )}
      {!loading && (
        <div className="w-full py-2 relative border-x-8 border-transparent">
          <Card className="border-none shadow-none">
            <CardHeader className="flex-row gap-2">
              <Avatar
                className="h-8 w-8 cursor-pointer"
                onClick={() => {
                  navig(`/community/${Post.community._id}`);
                }}
              >
                <AvatarImage
                  className="object-cover"
                  src={Post.community.avatar || "/klogo.png"}
                  alt="@shadcn"
                />
                <AvatarFallback>k/</AvatarFallback>
              </Avatar>
              <p className="font-bold">k/{Post.community.communityName}</p>
            </CardHeader>
            <CardContent>
              <p className="text-wrap text-xs font-bold">{Post.title}</p>
            </CardContent>
            <CardContent className="">
              {Post.description != "" && Post.media.length === 0 && (
                <CardDescription>{Post.description}</CardDescription>
              )}
              {Post.media.length != 0 && (
                <Carousel className="">
                  <CarouselContent className="">
                    {Post.media.map((element) => {
                      if (element.Type.startsWith("image/"))
                        return (
                          <CarouselItem className="flex justify-center items-center">
                            <img
                              src={element.Link}
                              className="object-cover md:max-h-[300px]"
                            />
                          </CarouselItem>
                        );
                      else {
                        return (
                          <CarouselItem className="flex justify-center items-center">
                            <video
                              className="md:max-h-[300px]"
                              controls
                              src={element.Link}
                            ></video>
                          </CarouselItem>
                        );
                      }
                    })}
                  </CarouselContent>
                  {Post.media.length > 1 && (
                    <>
                      <CarouselPrevious />
                      <CarouselNext />
                    </>
                  )}
                </Carousel>
              )}
            </CardContent>
            <CardFooter className="bg-grey flex justify-between">
              <div className="flex gap-1 sm:gap-4 sm:w-1/2 justify-between">
                {!load && like && (
                  <div className="flex items-center hover:bg-slate-200 dark:hover:bg-black p-2 rounded-lg select-none cursor-pointer text-sm sm:text-xl">
                    <PlugsConnected
                      className="text-orange-600"
                      size={32}
                      onClick={unlikePost}
                    />
                  </div>
                )}
                {
                  load && (<div className="flex items-center hover:bg-slate-200 dark:hover:bg-black p-2 rounded-lg select-none cursor-pointer text-sm sm:text-xl">
                  <Plugs
                    className="hover:text-orange-600"
                    size={32}
                    disabled
                  />
                </div>)
                }
                {!load && !like && (
                  <div className="flex items-center hover:bg-slate-200 dark:hover:bg-black p-2 rounded-lg select-none cursor-pointer text-sm sm:text-xl">
                    <Plugs
                      className="hover:text-orange-600"
                      size={32}
                      onClick={likePost}
                    />
                  </div>
                )}
                <div className="flex items-center hover:bg-slate-200 dark:hover:bg-black p-2 rounded-lg select-none cursor-pointer">
                  <ChatCentered
                    size={32}
                    onClick={() => {
                      navig(`/post/${Post._id}`);
                    }}
                    className="hover:text-orange-600"
                  />
                </div>
                <div className="flex items-center absolute top-9 right-4 sm:relative sm:top-0 sm:right-0">
                  <Dialog>
                    <DialogTrigger className="text-center">
                      <ShareFat size={32} className="hover:text-orange-600" />
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Shareable-Link</DialogTitle>
                        <DialogDescription>
                          <Input
                            value={`http://localhost:5173/post/${Post._id}`}
                          />
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              <div className="flex justify-end w-full truncate">
                <Link
                  to={`/user/${Post.user._id}`}
                  className="text-sm sm:text-lg"
                >
                  <span className="hover:text-orange-600 text-sm sm:text-lg">
                    u/{Post.user.username}
                  </span>
                </Link>
              </div>
            </CardFooter>
            <CardContent className="flex gap-1">
              <Input
                placeholder="comment on post"
                value={comment}
                onChange={(e) => {
                  setComment(e.target.value);
                }}
              />
              {!load && (
                <Button className="w-1/3 sm:w-1/4" onClick={postComment}>
                  Comment
                </Button>
              )}
              {load && (
                <Button className="w-1/3 sm:w-1/4" disabled>
                  ...
                </Button>
              )}
            </CardContent>
          </Card>
          {Comments.length > 0 && (
            <div>
              {Comments.map((element) => {
                return (
                  <CardContent className="flex flex-col gap-2 py-2 ">
                    <div className="flex items-center gap-2">
                      <Avatar
                        className="h-8 w-8 cursor-pointer"
                        onClick={() => {
                          navig(`/user/${element.user._id}`);
                        }}
                      >
                        <AvatarImage
                          className="object-cover"
                          src={element.user.avatar || "/klogo.png"}
                          alt="@shadcn"
                        />
                        <AvatarFallback>k/</AvatarFallback>
                      </Avatar>
                      <p>u/{element.user.username}</p>
                    </div>
                    <CardDescription>{element.comment}</CardDescription>
                  </CardContent>
                );
              })}
            </div>
          )}
          {Comments.length === 0 && (
            <CardContent className="flex justify-center">
              this post has no comments
            </CardContent>
          )}
        </div>
      )}
    </>
  );
};
