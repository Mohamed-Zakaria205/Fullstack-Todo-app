import Button from "./ui/Button";
import useAuthenticatedQuery from "../hooks/useAuthenticatedQuery";

const TodoList = () => {
  const storageKey = "loggedInUser";
  const userDataString = localStorage.getItem(storageKey);
  const userData = userDataString ? JSON.parse(userDataString) : null;

  const { isLoading, data } = useAuthenticatedQuery({
    url: "/users/me?populate=todos&status=published",
    queryKey: "todos",
    config: {
      headers: {
        Authorization: `bearer ${userData?.jwt}`,
      },
    },
  });

  if (isLoading) return "Loading...";

  return (
    <div className="max-w-lg mx-auto space-y-3">
      {data.todos.length ? (
        data.todos.map((todo: { id: number; title: string }) => (
          <div
            key={todo.id}
            className="flex items-center justify-between hover:bg-gray-100 p-3 rounded-md"
          >
            <p className="w-full font-semibold text-lg">-{todo.title}</p>
            <div className="flex items-center justify-start gap-x-2">
              <Button className="bg-indigo-600" size={"sm"}>
                Edit
              </Button>
              <Button className="bg-red-600" size={"sm"}>
                Delete
              </Button>
            </div>
          </div>
        ))
      ) : (
        <h3>No todos yet</h3>
      )}
    </div>
  );
};

export default TodoList;
