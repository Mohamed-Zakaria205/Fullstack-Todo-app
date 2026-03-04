import { useEffect, useState } from "react";
import Button from "./ui/Button";
import { axiosInstance } from "../config";

const TodoList = () => {
  const [isLoading, setIsLoading] = useState(true);
  const storageKey = "loggedInUser";
  const userDataString = localStorage.getItem(storageKey);
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const [todos, setTodos] = useState([]);
  useEffect(() => {
    try {
      axiosInstance
        .get("/users/me?populate=todos&status=published", {
          headers: {
            Authorization: `Bearer ${userData?.jwt}`,
          },
        })
        .then((res) => {
          console.log(res);
          setTodos(res.data.todos);
        })
        .catch((err) => console.log(err));
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [userData?.jwt]);

  if (isLoading) return <p className="text-center">Loading...</p>;
  return (
    <div className="max-w-lg mx-auto space-y-3">
      {todos.length ? (
        todos.map((todo) => {
          console.log(todo);
          return (
            <div
              className="flex items-center justify-between hover:bg-gray-100 p-3 rounded-md"
              key={todo.id}
            >
              <p className="w-full font-semibold text-lg">-{`${todo.title}`}</p>
              <div className="flex items-center justify-start gap-x-2">
                <Button className="bg-indigo-600" size={"sm"}>
                  Edit
                </Button>
                <Button className="bg-red-600" size={"sm"}>
                  Delete
                </Button>
              </div>
            </div>
          );
        })
      ) : (
        <h2 className="text-center text-lg">no todos yet!</h2>
      )}
    </div>
  );
};

export default TodoList;
