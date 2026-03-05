import Button from "./ui/Button";
import useAuthenticatedQuery from "../hooks/useAuthenticatedQuery";
import { useState } from "react";
import Modal from "./ui/Modal";
import { Input } from "@headlessui/react";

const TodoList = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
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

  /**Handlers */
  const onToggleEditModal = () => {
    setIsEditModalOpen((prev) => !prev);
  };
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
              <Button
                className="bg-indigo-600"
                size={"sm"}
                onClick={onToggleEditModal}
              >
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
      {/*Edit todo Modal */}
      <Modal
        isOpen={isEditModalOpen}
        close={onToggleEditModal}
        title="Edit this todo"
      >
        <Input
          className="w-full p-4 border border-gray-300 rounded-md"
          value={"Edit todo"}
        />
        <div className="flex items-center  space-x-2 mt-4">
          <Button className="bg-indigo-700 hover:bg-indigo-800">Update</Button>
          <Button variant={"cancel"} onClick={onToggleEditModal}>
            Cancel
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default TodoList;
