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
import TodoSkeleton from "./TodoSkeleton";

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

  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [todoToEdit, setTodoToEdit] = useState<ITodo>({
    title: "",
    description: "",
    documentId: "",
    id: 0,
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
        Authorization: `Bearer ${userData?.jwt}`,
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
      id: 0,
    });
  };
  const onOpenEditModal = (todo: ITodo) => {
    setIsEditModalOpen(true);
    setTodoToEdit(todo);
  };

  const onOpenConfirmModal = (todo: ITodo) => {
    setIsOpenConfirmModal(true);
    setTodoToEdit(todo);
  };
  const onCloseConfirmModal = () => {
    setIsOpenConfirmModal(false);
    setTodoToEdit({
      title: "",
      description: "",
      documentId: "",
      id: 0,
    });
  };
  if (isLoading) {
    return (
      <>
        {Array.from({ length: 5 }, (_, idx) => (
          <TodoSkeleton key={idx} />
        ))}
      </>
    );
  }

  const onChangeHandler = (
    evt: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { value, name } = evt.target;

    setTodoToEdit({
      ...todoToEdit,
      [name]: value,
    });
  };

  const onRemove = async () => {
    try {
      const res = await axiosInstance.delete(
        `/todos/${todoToEdit.documentId}`,
        {
          headers: {
            Authorization: `Bearer ${userData?.jwt}`,
          },
        },
      );

      if (res.status === 204) {
        toast.success("Todo deleted successfully!", {
          position: "bottom-center",
        });
        onCloseConfirmModal();
      }
    } catch (error) {
      const errObj = error as AxiosError<IErrorResponse>;
      toast.error(`${errObj.response?.data.error.message}`, {
        position: "bottom-center",
      });
    }
  };
  return (
    <div className="max-w-lg mx-auto space-y-3">
      {data.todos.length ? (
        data.todos.map((todo: ITodo) => (
          <div
            key={todo.documentId}
            className="flex items-center justify-between hover:bg-gray-100 p-3 rounded-md"
          >
            <p className="w-full font-semibold text-lg">
              {todo.id}- {todo.title}
            </p>
            <div className="flex items-center justify-start gap-x-2">
              <Button
                className="bg-indigo-600 hover:bg-indigo-300 hover:text-black"
                size={"sm"}
                onClick={() => onOpenEditModal(todo)}
              >
                Edit
              </Button>
              <Button
                className="bg-red-500 hover:bg-red-300 hover:text-black"
                size={"sm"}
                onClick={() => onOpenConfirmModal(todo)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))
      ) : (
        <h3 className="text-center text-lg">No todos yet!</h3>
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

      {/* Delete todo Modal */}
      <Modal
        isOpen={isOpenConfirmModal}
        close={onCloseConfirmModal}
        title="Are you sure you want to remove this product?"
        description="This action cannot be undone. The product will be permanently removed from your inventory."
      >
        <div className="flex items-center space-x-3 text-white ">
          <Button
            className="bg-red-700 hover:bg-red-400"
            fullWidth
            onClick={onRemove}
          >
            Yes, Remove
          </Button>
          <Button
            className="bg-gray-400 hover:bg-gray-200 hover:text-black"
            onClick={onCloseConfirmModal}
            fullWidth
          >
            Cancel
          </Button>
        </div>
      </Modal>
    </div>
  );
};
export default TodoList;
