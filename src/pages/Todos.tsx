import TodoSkeleton from "../components/TodoSkeleton";
import Paginator from "../components/ui/Paginator";
import useAuthenticatedQuery from "../hooks/useAuthenticatedQuery";
import { ITodo } from "../interfaces";

// Handlers
const TodosPage = () => {
  const storageKey = "loggedInUser";
  const userDataString = localStorage.getItem(storageKey);
  const userData = userDataString ? JSON.parse(userDataString) : null;

  const { data, isLoading } = useAuthenticatedQuery({
    url: "/todos",
    queryKey: ["paginatedTodos"],
    config: {
      headers: {
        Authorization: `Bearer ${userData?.jwt}`,
      },
    },
  });

  console.log(data);
  if (isLoading) {
    return (
      <>
        {Array.from({ length: 5 }, (_, idx) => (
          <TodoSkeleton key={idx} />
        ))}
      </>
    );
  }
  return (
    <div className="space-y-6">
      {data.data.length ? (
        data.data.map((todo: ITodo) => (
          <div
            key={todo.documentId}
            className="flex items-center justify-between hover:bg-gray-100 p-3 rounded-md"
          >
            <p className="w-full font-semibold text-lg">
              {todo.id}- {todo.title}
            </p>
          </div>
        ))
      ) : (
        <h3 className="text-center text-lg">No todos yet!</h3>
      )}
      <Paginator />
    </div>
  );
};

export default TodosPage;
