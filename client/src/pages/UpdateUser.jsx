import React, { useRef, useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSelector } from "react-redux";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import axios from "axios";
import { useDispatch } from "react-redux";
import { Pencil } from "@phosphor-icons/react";
import { serverlink } from "@/link";
import { updateUserSuccess } from "@/redux/user/userSlice";
import { useNavigate } from "react-router-dom";
import { app } from "../Firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { Textarea } from "@/components/ui/textarea";
export default function UpdateUser() {
  const navig = useNavigate();
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const PpicRef = useRef(null);
  const [error, setError] = useState("");
  const [avatarFile, setAvatarFile] = useState();
  const [coverFile, setCoverFile] = useState();
  const [load, setLoad] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    Name: currentUser.rest.Name,
    userLinks: currentUser.rest.userLinks,
    about: currentUser.rest.about,
    avatar: currentUser.rest.avatar,
    cover: currentUser.rest.cover,
  });
  const [password, setPassword] = useState({
    oldpassword: "",
    password: "",
    cpassword: "",
  });
  const [Link, setLink] = useState({
    Name: "",
    Link: "",
  });
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
  const handleLinkDelete = (index) => {
    const temp = [...formData.userLinks];
    temp.splice(index, 1);
    setFormData({ ...formData, userLinks: temp });
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
    const temp = [...formData.userLinks];
    temp.push(Link);
    setFormData({ ...formData, userLinks: temp });
    setLink({
      Name: "",
      Link: "",
    });
    setError("");
  };
  const updateChangeUser = async () => {
    const token = window.localStorage.getItem("token");
    try {
      setLoad(true);
      const response = await axios.put(`${serverlink}/user/updateUser`, {
        token,
        ...formData,
      });
      dispatch(updateUserSuccess({ rest: response.data }));
      setLoad(false);
    } catch (error) {
      console.log(error);
    }
  };
  const handlePassChange = (e) => {
    setPassword({ ...password, [e.target.id]: e.target.value });
  };
  const changePassword = async () => {
    const token = window.localStorage.getItem("token");
    
    if(password.cpassword === ""|| password.password==="")
    {
      setError("some of the fields are empty");
      return;
    }
    if(password.password != password.cpassword)
    {
      setError("new password and confirm password do not match");
      return;
    }
      setLoad(true);
    try {
      const response = await axios.put(`${serverlink}/user/changePassword`, {
        token,
        ...password,
      });
      setLoad(false);
      setError("");
      navig(`/user/${currentUser.rest._id}`)
    } catch (error) {
      if(error.response)
        {
          setError(error.response.data.message);
        }
      else
      {
        console.log(error);
        setError("unknown error occured");
      }
      setLoad(false);
    }
  };
  return (
    <div>
      <Card className=" border-none shadow-none">
        <CardContent className="flex flex-col gap-1 sm:gap-2 sm:flex-row">
          <Button className="mt-2 w-full" onClick={()=>{navig(`/user-posts-community/${currentUser.rest._id}`)}}>Manage Communities and posts</Button>
          <Dialog>
            <Button className="w-full mt-2">
              <DialogTrigger className="w-full">Change Password</DialogTrigger>
            </Button>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Change Password</DialogTitle>
                <Card className="bg-none shadow-none border-none">
                  <CardContent className="flex flex-col gap-2">
                    <Input
                      id="oldpassword"
                      type="password"
                      placeholder="old password"
                      onChange={handlePassChange}
                      value={password.oldpassword}
                    />
                    <Input
                      id="password"
                      placeholder="new password"
                      type="password"
                      onChange={handlePassChange}
                      value={password.password}
                    />
                    <Input
                      id="cpassword"
                      placeholder="confirm new password"
                      onChange={handlePassChange}
                      value={password.cpassword}
                    />
                    {!load && <Button onClick={changePassword}>Change Password</Button>}
                    {load && <Button disabled>Change Password</Button>}
                    <p className="text-red-600">{error}</p>
                  </CardContent>
                </Card>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </CardContent>
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
              <AvatarImage src={formData.avatar} alt="PFP" />
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
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            disabled
            value={currentUser.rest.username}
            title="you can't change username"
          />
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            disabled
            value={currentUser.rest.email}
            title="you can't change email"
          />
          <Label htmlFor="name">Name</Label>
          <Input id="Name" value={formData.Name} onChange={handleChange} />
          <Label htmlFor="about">about</Label>
          <Textarea
            id="about"
            value={formData.about}
            onChange={handleChange}
            title="you can't change email"
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
          {!load && (
            <div className="flex gap-2">
              <Button className="mt-2 w-full" onClick={updateChangeUser}>
                Update User
              </Button>
            </div>
          )}
          {load && (
            <div className="flex gap-2">
              <Button
                className="mt-2 w-full"
                onClick={updateChangeUser}
                disabled
              >
                Update User
              </Button>
            </div>
          )}
          <p className="text-red-600 h-4">{error}</p>
        </CardContent>
        <CardContent>
          <CardTitle>Links</CardTitle>
          <div>
            {formData.userLinks &&
              formData.userLinks.map((element, index) => {
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
            {formData.userLinks.length === 0 &&
              "You currently have no links in your profile"}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
