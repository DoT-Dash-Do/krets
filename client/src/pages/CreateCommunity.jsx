import React, { useState } from "react";
import axios from "axios";
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
import { useNavigate } from "react-router-dom";

export default function CreateCommunity() {
  const navig = useNavigate();
  const [formData, setFormData] = useState({});
  const [links, setLinks] = useState([]);
  const [rules, setRules] = useState([]);
  const [error, setError] = useState("");
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const addLink = () => {
    if (
      !formData.linkName ||
      !formData.currentLink ||
      !formData.currentLink === "" ||
      formData.currentLink === ""
    ) {
      setError("fields cant be empty");
      return;
    }
    setLinks([
      ...links,
      { Name: formData.linkName, Link: formData.currentLink },
    ]);
    setFormData({ ...formData, currentLink: "", linkName: "" });
    setError("");
  };
  const handleRuleDelete = (index) => {
    const temp = [...rules];
    temp.splice(index, 1);
    setRules(temp);
  };
  const handleLinkDelete = (index) => {
    const temp = [...links];
    temp.splice(index, 1);
    setLinks(temp);
  };
  const addRule = () => {
    if (!formData.currentRule || formData.currentRule === "") {
      setError("fields cant be empty");
      return;
    }
    setRules([...rules, formData.currentRule]);
    setFormData({ ...formData, currentRule: "" });
    setError("");
  };
  const handleSubmit = async () => {
    const token = window.localStorage.getItem("token");
    if (
      !formData.communityName ||
      !formData.about ||
      formData.communityName === "" ||
      formData.about === ""
    ) {
      setError("fields cant be empty");
      return;
    }
    try {
      const response = await axios.post(`${serverlink}/user/createCommunity`, {
        token,
        ...formData,
        links,
        rules,
      });
      setFormData({});
      setLinks([]);
      setRules([]);
      navig("/");
    } catch (error) {
      setError(error.response.data.message);
    }
  };
  return (
    <div className="flex flex-col items-center xl:border-0 border-x-8 border-transparent h-full">
      <div className="w-full">
        <Card className="border-none shadow-none">
          <CardHeader>
            <CardTitle className="text-2xl">Create Community</CardTitle>
            <CardDescription>
              Create a community to connect with krettors around the world who
              have similar interest
            </CardDescription>
          </CardHeader>

          <CardContent className="flex gap-4 flex-col">
            <div className="flex flex-col gap-2">
              <Label htmlFor="communityName">Community Name</Label>
              <Input
                id="communityName"
                onChange={handleChange}
                className="focus:ring-1"
                value={formData.communityName || ""}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="about">About Community</Label>
              <Textarea
                id="about"
                onChange={handleChange}
                value={formData.about || ""}
              />
            </div>
            <div className="flex flex-col gap-2">
              <CardDescription>Add Links for your community</CardDescription>
              <div className="flex flex-row gap-2">
                <Input
                  className="w-1/3 focus:ring-1"
                  id="linkName"
                  onChange={handleChange}
                  placeholder="Name"
                  value={formData.linkName || ""}
                />
                <Input
                  id="currentLink"
                  onChange={handleChange}
                  className="focus:ring-1"
                  placeholder="Link"
                  value={formData.currentLink || ""}
                />
                <Button onClick={addLink}>Add Link</Button>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <CardDescription>Add Rules for your community</CardDescription>
              <Textarea
                id="currentRule"
                onChange={handleChange}
                placeholder="Rule"
                value={formData.currentRule || ""}
              />
              <Button onClick={addRule}>Add Rule</Button>
            </div>
            <Button onClick={handleSubmit}>Create Community</Button>
          </CardContent>
          <CardContent className="text-red-600">{error}</CardContent>
        </Card>
      </div>
      {rules.length !== 0 && (
        <div className="w-full">
          <Card className="border-none shadow-none">
            <CardContent>
              <p>Rules</p>
              <div>
                {rules &&
                  rules.map((element, index) => {
                    return (
                      <div className="truncate flex flex-row gap-1">
                        <p>{index + 1}.</p>
                        <p className="w-[250px] truncate">{element}</p>
                        <button
                          className="text-red-600 g hover:underline"
                          onClick={() => handleRuleDelete(index)}
                        >
                          delete
                        </button>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      {links.length != 0 && (
        <div className="w-full">
          <Card className="border-none shadow-transparent">
            <CardContent>
              <p>Links</p>
              <div>
                {links &&
                  links.map((element, index) => {
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
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
