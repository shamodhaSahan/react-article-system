import { useEffect, useState } from "react";
import { FaEye, FaPen, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import { formateDate } from "../util/datehandler";
import Swal from "sweetalert2";

interface Data {
  id: string;
  publishedDate: string;
  title: string;
  description: string;
}

const MyArticles = (): JSX.Element => {
  const [data, setData] = useState<Data[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      navigate("/signin");
    } else {
      getmyArticles();
    }
  }, []);

  const getmyArticles = () => {
    axios
      .get("http://localhost:8081/article/get/my?size=10&page=1", {
        headers: {
          "Content-Type": "application/json",
          Authorization: Cookies.get("token"),
        },
      })
      .then((res) => {
        setData(res.data.data);
      })
      .catch(() => {});
  };

  const handleDelete = (r: any) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be delete this article!",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:8081/article/${r._id}`, {
            headers: { Authorization: Cookies.get("token") },
          })
          .then(() => {
            Swal.fire({
              icon: "success",
              title: "successfully",
              text: "Article deleted successfully!!",
            });
            getmyArticles();
          })
          .catch(() => {
            Swal.fire({
              icon: "error",
              title: "Unsuccessfull",
              text: "Fail to deleted Article!",
            });
          });
      }
    });
  };

  return (
    <section>
      <div className={"my-5 mx-20"}>
        {data.length === 0 ? (
          <h1 className="text-2xl text-center text-red-600">
            Record not found!
          </h1>
        ) : (
          <table>
            <thead className={"bg-gray-100"}>
              <tr>
                <th className={"py-5"}>Date</th>
                <th className={"py-5"}>Title</th>
                <th className={"py-5"}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {data.map((r: Data, index: number) => {
                return (
                  <tr key={index} className={"border-b"}>
                    <td className={"w-[15%]"}>
                      {formateDate(r.publishedDate)}
                    </td>
                    <td className={"w-[50%]"}>{r.title}</td>
                    <td className={"w-[15%]"}>
                      <button
                        className={
                          "bg-blue-600 text-white p-3 rounded-full mx-2"
                        }
                        onClick={() =>
                          navigate("/article", {
                            state: {
                              title: r.title,
                              description: r.description,
                            },
                          })
                        }
                      >
                        <FaEye />
                      </button>
                      <button
                        className={
                          "bg-green-600 text-white p-3 rounded-full mx-2"
                        }
                        onClick={() =>
                          navigate("/editor", { state: { article: r } })
                        }
                      >
                        <FaPen />
                      </button>
                      <button
                        onClick={() => handleDelete(r)}
                        className={
                          "bg-red-600 text-white p-3 rounded-full mx-2"
                        }
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
};

export default MyArticles;
