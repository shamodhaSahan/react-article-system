import React, { useEffect, useState } from "react";
import Input from "./../components/input/input";
import * as ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import { useLocation, useNavigate } from "react-router-dom";

function Editor() {
  const navigate = useNavigate();
  const location = useLocation();

  let article = location?.state?.article;

  const [title, setTitle] = useState<string>(article ? article.title : "");
  const [description, setDescription] = useState<string>(
    article ? article.description : ""
  );

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      navigate("/signin");
    }
  }, []);

  const handleEditor = (html: any): void => {
    console.log(html);
    setDescription(html);
  };

  const handleTitle = (e: any): void => {
    setTitle(e.target.value);
  };

  const hndlePublish = (): void => {
    if (title && description) {
      if (article) {
        Swal.fire({
          title: "Are you sure?",
          text: "You won't be update this article!",
          icon: "question",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, update it!",
        }).then((result) => {
          if (result.isConfirmed) {
            axios
              .put(
                "http://localhost:8081/article/",
                {
                  id: article._id,
                  title: title,
                  description: description,
                },
                {
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: Cookies.get("token"),
                  },
                }
              )
              .then(() => {
                Swal.fire({
                  icon: "success",
                  title: "Success!",
                  text: "Article updated successfully!",
                });
                navigate("/my-articles");
              })
              .catch((err: any) => {
                console.log(err);
                Swal.fire({
                  icon: "error",
                  title: "Unsuccessfull",
                  text: "Fail to update Article!",
                });
              });
          }
        });
      } else {
        axios
          .post(
            "http://localhost:8081/article",
            {
              title: title,
              description: description,
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: Cookies.get("token"),
              },
            }
          )
          .then(() => {
            Swal.fire({
              icon: "success",
              title: "Success!",
              text: "Article saved successfully!",
            });
          })
          .catch((err: any) => {
            console.log(err);
            Swal.fire({
              icon: "error",
              title: "Unsuccessfull",
              text: "Fail to save Article!",
            });
          });
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Invalid input!",
        text: "title or description wrong!",
      });
    }
  };

  return (
    <section className={"px-28"}>
      <div className={"text-right mt-5"}>
        <button className={"second-btn mr-1"}>Clear</button>
        <button onClick={hndlePublish} className={"main-btn ml-1"}>
          {article ? "Update" : "Publish"}
        </button>
      </div>

      <Input
        type={"text"}
        name={"title"}
        label={"Title"}
        callBack={handleTitle}
        placeholder={"Enter the title"}
        optional={false}
        value={title}
      />

      <div className={"m-2"}>
        <ReactQuill theme="snow" value={description} onChange={handleEditor} />
      </div>
    </section>
  );
}

export default Editor;
