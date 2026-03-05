import Button from "./ui/Button";
import useAuthenticatedQuery from "../hooks/useAuthenticatedQuery";
import { ChangeEvent, useState } from "react";
import Modal from "./ui/Modal";
import { Input, Textarea } from "@headlessui/react";
import { IErrorResponse, ITodo } from "../interfaces";
import { axiosInstance } from "../config";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useForm, SubmitHandler } from "react-hook-form";
import InputErrorMessage from "./ui/InputErrorMessage";

interface ITodoForm {
  title: string;
  description?: string;
}

const TodoList = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ITodoForm>();

  console.log(errors);
  const onSubmit: SubmitHandler<ITodoForm> = async () => {
    const { documentId, title, description } = todoToEdit;
    setIsUpdating(true);
    try {
      const { status } = await axiosInstance.put(
        `/todos/${documentId}`,
        {
          data: {
            title,
            description,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${userData?.jwt}`,
          },
        },
      );
      toast.success("Todo updated successfully", {
        position: "bottom-center",
      });

      if (status === 200) {
        onCloseEditModal();
      }
    } catch (error) {
      const errObj = error as AxiosError<IErrorResponse>;
      toast.error(`${errObj.response?.data.error.message}`, {
        position: "bottom-center",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const [isUpdating, setIsUpdating] = useState(false);
  const [todoToEdit, setTodoToEdit] = useState<ITodo>({
    title: "",
    description: "",
    documentId: "",
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const storageKey = "loggedInUser";
  const userDataString = localStorage.getItem(storageKey);
  const userData = userDataString ? JSON.parse(userDataString) : null;

  const { isLoading, data } = useAuthenticatedQuery({
    url: "/users/me?populate=todos&status=published",
    queryKey: ["todoList", todoToEdit.documentId],
    config: {
      headers: {
        Authorization: `bearer ${userData?.jwt}`,
      },
    },
  });

  /**Handlers */
  const onCloseEditModal = () => {
    setIsEditModalOpen(false);
    setTodoToEdit({
      title: "",
      description: "",
      documentId: "",
    });
  };
  const onOpenEditModal = (todo: ITodo) => {
    setIsEditModalOpen(true);
    setTodoToEdit(todo);
  };

  if (isLoading) return "Loading...";

  const onChangeHandler = (
    evt: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { value, name } = evt.target;

    setTodoToEdit({
      ...todoToEdit,
      [name]: value,
    });
  };

  return (
    <div className="max-w-lg mx-auto space-y-3">
      {data.todos.length ? (
        data.todos.map((todo: ITodo) => (
          <div
            key={todo.documentId}
            className="flex items-center justify-between hover:bg-gray-100 p-3 rounded-md"
          >
            <p className="w-full font-semibold text-lg">-{todo.title}</p>
            <div className="flex items-center justify-start gap-x-2">
              <Button
                className="bg-indigo-600"
                size={"sm"}
                onClick={() => onOpenEditModal(todo)}
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
        close={onCloseEditModal}
        title="Edit this todo"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            {...register("title", { required: true })}
            className="w-full p-4 border border-gray-300 rounded-md"
            name="title"
            onChange={onChangeHandler}
            value={todoToEdit.title}
          />
          {errors.title?.type === "required" && (
            <InputErrorMessage message="this title is required" />
          )}
          <Textarea
            {...register("description", { minLength: 20 })}
            className="w-full p-4 border border-gray-300 rounded-md mt-4"
            name="description"
            onChange={onChangeHandler}
            placeholder="Description"
            rows={7}
            value={todoToEdit.description}
          />
          {errors.description?.type === "minLength" && (
            <InputErrorMessage message="this description must be at least 20 characters long" />
          )}
          <div className="flex items-center  space-x-2 mt-4">
            <Button
              className="bg-indigo-700 hover:bg-indigo-800"
              isLoading={isUpdating}
            >
              {isUpdating ? "Updating..." : "Update"}
            </Button>
            <Button variant={"cancel"} onClick={onCloseEditModal}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
export default TodoList;
