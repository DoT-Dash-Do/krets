import React, { useState } from "react";
import axios from "axios";
import { uploadBytesResumable } from "firebase/storage";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { app } from "../Firebase.js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { serverlink } from "@/link";
import { useNavigate, useParams } from "react-router-dom";
import { Trash } from "@phosphor-icons/react";
export default function CreatePost() {
  const params = useParams();
  const navig = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    media: [],
    community: params.id
  });
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const [desc, setDesc] = useState("Upload your files here");
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_change",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setDesc(`uploading ${Math.round(progress)} %`);
        },
        (error) => {
          reject(error);
        },
        () => {
          const contentType = file.type;
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            resolve({ Link: downloadUrl, Type: contentType });
          });
        }
      );
    });
  };
  const handleImageSumbit = (e) => {
    if (files.length > 0 && files.length + formData.media.length < 6) {
      setLoading(true);
      const promises = [];
      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({ ...formData, media: formData.media.concat(urls) });
          document.getElementById("media").value = "";
          setError("");
          setLoading(false);
          setFiles([]);
        })
        .catch((err) => {
          console.log(err);
          setError("please check the files uploaded <2mb");
          setLoading(false);
        });

      return;
    } else {
      setError("Images should not be more than 5");
    }
  };
  const handleSubmit = async () => {
    const token = window.localStorage.getItem("token");
    if (!formData.title || formData.title === "") {
      setError("fields cant be empty");
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post(`${serverlink}/user/createPost`, {
        token,
        ...formData,
      });
      setFormData({ title: "", description: "", media: [] });
      setError("");
      setDesc("Upload your files here");
      setLoading(false);
      // navig("/");
    } catch (error) {
      setError(error.response.data.message);
      setLoading(false);
    }
  };
  const handleImageDel = async (e) => {
    const updatedMedia = [...formData.media];
    updatedMedia.splice(e.currentTarget.id, 1);
    setFormData({ ...formData, media: updatedMedia });
  };
  return (
    <div className="flex flex-col items-center xl:border-0 border-x-8 border-col border-transparent">
      <div className="w-full">
        <Card className="border-none shadow-none">
          <CardHeader>
            <CardTitle className="text-2xl">Create Post</CardTitle>
            <CardDescription>Show your interest in the topic</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-4 flex-col">
            <div className="flex flex-col gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                className="focus:ring-1"
                onChange={handleChange}
                value={formData.title || ""}
              />
            </div>
            <Tabs defaultValue="Description" className="">
              <TabsList>
                <TabsTrigger value="Description">Description</TabsTrigger>
                <TabsTrigger value="Media">Media</TabsTrigger>
              </TabsList>
              <TabsContent value="Description">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    
                    id="description"
                    onChange={handleChange}
                    value={formData.description || ""}
                  />
                </div>
              </TabsContent>
              <TabsContent value="Media">
                <Label htmlFor="media">Media</Label>
                <CardDescription>{desc}</CardDescription>
                <div className="flex flex-row gap-2">
                  <Input
                    type="file"
                    id="media"
                    onChange={(e) => setFiles(e.target.files)}
                    className="dark:file:text-white"
                  />
                  {!loading && (
                    <Button
                      className="w-1/3"
                      onClick={handleImageSumbit}
                      multiple
                    >
                      Upload
                    </Button>
                  )}
                  {loading && (
                    <Button
                      className="w-1/3"
                      onClick={handleImageSumbit}
                      multiple
                      disabled
                    >
                      Upload
                    </Button>
                  )}
                </div>
              </TabsContent>
            </Tabs>
            {!loading && (
              <Button
                onClick={() => {
                  handleSubmit();
                }}
              >
                Create Post
              </Button>
            )}
            {loading && <Button disabled>Create Post</Button>}
          </CardContent>
          <CardContent className="text-red-600">{error}</CardContent>
        </Card>
        {formData.media.length !== 0 && (
          <Card className="p-2 border shadow-none flex flex-row overflow-auto style-3 gap-2">
            {formData.media.map((element, i) => {
              return (
                <div key={i} id={i} className="border-2 relative rounded-lg">
                  <div className="flex justify-end absolute right-0">
                    <div
                      id={i}
                      onClick={handleImageDel}
                      className="p-2 text-2xl  bg-black dark:bg-white text-white dark:text-black select-none cursor-pointer rounded-tr-md"
                    >
                      <Trash />
                    </div>
                  </div>
                  {element.Type.startsWith("image/") && (
                    <div className="w-36 md:w-48 h-36 md:h-48 border-2 border-gray-500 rounded-md">
                      <img
                        src={element.Link}
                        alt="Loading . . ."
                        className="flex justify-center items-center w-full h-full rounded-md object-contain"
                      />
                    </div>
                  )}
                  {element.Type.startsWith("video/") && (
                    <div className="w-36 md:w-48 h-36 md:h-48 border-2 border-gray-500 rounded-md">
                      <video
                        src={element.Link}
                        alt="Loading . . ."
                        className="flex justify-center items-center w-full h-full rounded-md object-contain"
                        autoPlay
                        muted
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </Card>
        )}
      </div>
    </div>
  );
}
