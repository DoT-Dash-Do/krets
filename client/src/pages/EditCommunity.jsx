import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardTitle } from "../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Pencil, Trash } from "@phosphor-icons/react";
import { serverlink } from "@/link";
import { useParams } from "react-router-dom";
import { app } from "../Firebase";
import { Postcard } from "@/components/Postcard";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function EditCommunity() {
  const params = useParams();
  const fileRef = useRef(null);
  const buttonRef = useRef(null);
  const PpicRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ links: [], rules: [] });
  const [avatarFile, setAvatarFile] = useState();
  const [coverFile, setCoverFile] = useState();
  const [load, setLoad] = useState(false);
  const [error, setError] = useState("");
  const [posts, setPosts] = useState([]);
  const [Link, setLink] = useState({
    Name: "",
    Link: "",
  });
  const [rule, setRule] = useState("");
  const [message, setMessage] = useState("");
  useEffect(() => {
    if (avatarFile) {
      handleFileUpload(avatarFile, "avatar");
    }
  }, [avatarFile]);

  useEffect(() => {
    if (coverFile) {
      handleFileUpload(coverFile, "cover");
    }
  }, [coverFile]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleLinkChange = (e) => {
    setLink({ ...Link, [e.target.id]: e.target.value });
  };
  const handleRuleChange = (e) => {
    setRule(e.target.value);
  };
  const handleFileUpload = (file, type) => {
    setLoad(true);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(Math.round(progress));
      },
      (error) => {
        console.log(error);
        setError("error while uploading file");
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          setFormData({ ...formData, [type]: downloadUrl });
        });
      }
    );
    setLoad(false);
  };
  const addLink = () => {
    if (!Link.Link || Link.Name === "" || !Link.Name || Link.Link === "") {
      setError("fields cant be empty");
      return;
    }
    const temp = [...formData.links];
    temp.push(Link);
    setFormData({ ...formData, links: temp });
    setLink({
      Name: "",
      Link: "",
    });
    setError("");
  };
  const addRule = () => {
    if (rule === "") {
      setError("fields cant be empty");
      return;
    }
    const temp = [...formData.rules];
    temp.push(rule);
    setFormData({ ...formData, rules: temp });
    setRule("");
    setError("");
  };
  const handleLinkDelete = (index) => {
    const temp = [...formData.links];
    temp.splice(index, 1);
    setFormData({ ...formData, links: temp });
  };

  const handleRuleDelete = (index) => {
    const temp = [...formData.rules];
    temp.splice(index, 1);
    setFormData({ ...formData, rules: temp });
  };
  const updateCommunity = async () => {
    const token = window.localStorage.getItem("token");
    try {
      setLoad(true);
      const response = await axios.put(`${serverlink}/community/updateCommunity`, {
        commId: params.id,
        token,
        formData,
      });
      setMessage(response.data.message);
      buttonRef.current.click();
      setLoad(false);
    } catch (error) {
      setMessage(error.message);
      buttonRef.current.click();
      setLoad(false);
    }
  };
  const getCommunityDetails = async () => {
    try {
      setLoading(true);
      const { data } = await axios(
        `${serverlink}/community/getCommunityDetails/${params.id}`
      );

      setFormData({
        communityName: data.communityName,
        links: data.links,
        about: data.about,
        avatar: data.avatar,
        cover: data.cover,
        rules: data.rules,
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };
  const getCommunityPosts = async () => {
    try {
      const response1 = await axios(
        `${serverlink}/post/getCommunityPosts/${params.id}`
      );
      setPosts(response1.data);
    } catch (error) {
      console.log(error);
    }
  };
  const deletePost = async (postid) => {
    const token = window.localStorage.getItem("token");
    try {
      const response = await axios.post(`${serverlink}/post/deleteAdminPost`, {
        token,
        postid,
        commId:params.id
      });
      getCommunityPosts();
      setMessage(response.data.message);
      buttonRef.current.click();
    } catch (error) {
      setMessage(error.response.data.message);
      buttonRef.current.click();
    }
  };
  useEffect(() => {
    getCommunityDetails();
    getCommunityPosts();
  }, []);
  return (
    <div>
      {loading && <div className="w-full text-xl">loading...</div>}
      {!loading && (
        <Tabs defaultValue="account" className="w-full my-2">
          <TabsList className="bg-transparent w-full">
            <TabsTrigger
              value="account"
              className="data-[state=active]:shadow-none"
            >
              Edit Community
            </TabsTrigger>
            <TabsTrigger
              value="password"
              className="data-[state=active]:shadow-none"
            >
              Community Posts
            </TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <Card className="border-none shadow-none">
              <div className="relative flex w-full bg-cover h-[200px] border-x-8 border-t-8 rounded-lg border-transparent">
                <img
                  src={formData.cover === "" ? "/Combg.png" : formData.cover}
                  className="object-cover w-full rounded-lg"
                  alt="hello"
                />
                <input
                  type="file"
                  className="hidden"
                  ref={fileRef}
                  onChange={(e) => setCoverFile(e.target.files[0])}
                  accept="image/*"
                ></input>
                <Pencil
                  size={22}
                  className="h-8 w-8 p-1 absolute right-2 top-1 rounded-full bg-white dark:bg-black cursor-pointer"
                  onClick={() => fileRef.current.click()}
                />
              </div>
              <CardContent className="flex p-2 items-center gap-2 w-full justify-center mt-[-25px]">
                <div className="relative flex items-center justify-center">
                  <Avatar className=" bg-gray-900 h-14 w-14 border-2 select-none">
                    <AvatarImage
                      src={formData.avatar || "/klogo.png"}
                      alt="PFP"
                    />
                    <AvatarFallback className="Dark:bg-white text-orange-600 font-bold">
                      u/
                    </AvatarFallback>
                  </Avatar>
                  <input
                    type="file"
                    className="hidden"
                    ref={PpicRef}
                    onChange={(e) => setAvatarFile(e.target.files[0])}
                    accept="image/*"
                  ></input>
                  <Pencil
                    size={22}
                    className="h-6 w-6 p-1 absolute right-0 top-0 rounded-full bg-white dark:bg-black cursor-pointer"
                    onClick={() => PpicRef.current.click()}
                  />
                </div>
              </CardContent>
              <CardContent>
                <Label htmlFor="username">communityName</Label>
                <Input
                  id="communityName"
                  disabled
                  value={formData.communityName}
                  title="you can't change Community Name"
                />
                <Label htmlFor="about">about</Label>
                <Textarea
                  id="about"
                  value={formData.about}
                  onChange={handleChange}
                  title=""
                />
                <Label htmlFor="Link">Add Link</Label>
                <div className="flex gap-1">
                  <Input
                    id="Name"
                    placeholder="Name"
                    value={Link.Name}
                    onChange={handleLinkChange}
                  />
                  <Input
                    id="Link"
                    placeholder="add a new user link"
                    onChange={handleLinkChange}
                    value={Link.Link}
                  />
                  <Button className="w-1/4" onClick={addLink}>
                    Add Link
                  </Button>
                </div>
                <Label htmlFor="rule">Add Rule</Label>
                <div className="flex gap-1">
                  <Input
                    id="rule"
                    placeholder="add a new user link"
                    onChange={handleRuleChange}
                    value={rule}
                  />
                  <Button className="w-1/3" onClick={addRule}>
                    Add Rule
                  </Button>
                </div>
                {!load && (
                  <div className="flex gap-2">
                    <Button className="mt-2 w-full" onClick={updateCommunity}>
                      Update Community
                    </Button>
                  </div>
                )}
                {load && (
                  <div className="flex gap-2">
                    <Button className="mt-2 w-full" disabled>
                      Update Community
                    </Button>
                  </div>
                )}
                <p className="text-red-600 h-4">{error}</p>
              </CardContent>
              <CardContent>
                <CardTitle className>Links</CardTitle>
                <div>
                  {formData.links &&
                    formData.links.map((element, index) => {
                      return (
                        <div className="flex flex-row">
                          <a
                            href={element.Link}
                            target="_blank"
                            className="w-[270px] truncate"
                          >
                            {element.Name}
                          </a>
                          <button
                            className="text-red-600"
                            onClick={() => handleLinkDelete(index)}
                          >
                            delete
                          </button>
                        </div>
                      );
                    })}
                  {formData.links.length === 0 &&
                    "You currently have no links in your profile"}
                </div>
              </CardContent>
              <CardContent>
                <CardTitle className="mb-1">Rules</CardTitle>
                <div className="flex flex-col gap-1">
                  {formData.rules &&
                    formData.rules.map((element, index) => {
                      return (
                        <div className="flex flex-row justify-between w-[320px]">
                          <p className="w-[270px] truncate">
                            {index + 1}.{element}
                          </p>

                          <button
                            className="text-red-600"
                            onClick={() => handleRuleDelete(index)}
                          >
                            delete
                          </button>
                        </div>
                      );
                    })}
                  {formData.rules.length === 0 &&
                    "You currently have no rules in your community"}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="password">
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
