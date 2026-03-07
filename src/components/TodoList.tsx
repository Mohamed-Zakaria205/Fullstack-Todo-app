import Button from "./ui/Button";
import useAuthenticatedQuery from "../hooks/useAuthenticatedQuery";
import { useState } from "react";
import Modal from "./ui/Modal";
import Input from "./ui/Input";
import Textarea from "./ui/Textarea";
import { IErrorResponse, ITodo } from "../interfaces";
import { axiosInstance } from "../config";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useForm, SubmitHandler } from "react-hook-form";
import InputErrorMessage from "./ui/InputErrorMessage";
import TodoSkeleton from "./TodoSkeleton";
import { onGenerateTodos } from "../utils/functions";
// import { faker } from "@faker-js/faker";

interface ITodoForm {
  title: string;
  description?: string;
}

const TodoList = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ITodoForm>();

  const onSubmit: SubmitHandler<ITodoForm> = async (data) => {
    const { documentId } = todoToEdit;
    const { title, description } = data;
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
        setQueryVersion((prev) => prev + 1);
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

  const onAddSubmit: SubmitHandler<ITodoForm> = async (data) => {
    const { title, description } = data;
    setIsAdding(true);
    try {
      const { status } = await axiosInstance.post(
        `/todos`,
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
      toast.success("Todo Added successfully", {
        position: "bottom-center",
      });
      console.log("add status", status);
      if (status === 200) {
        onCloseAddModal();
        setQueryVersion((prev) => prev + 1);
      }
    } catch (error) {
      const errObj = error as AxiosError<IErrorResponse>;
      toast.error(`${errObj.response?.data.error.message}`, {
        position: "bottom-center",
      });
    } finally {
      setIsAdding(false);
    }
  };

  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [todoToEdit, setTodoToEdit] = useState<ITodo>({
    title: "",
    description: "",
    documentId: "",
    id: 0,
  });
  const [queryVersion, setQueryVersion] = useState(1);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const storageKey = "loggedInUser";
  const userDataString = localStorage.getItem(storageKey);
  const userData = userDataString ? JSON.parse(userDataString) : null;

  const { isLoading, data } = useAuthenticatedQuery({
    url: "/users/me?populate=todos&status=published",
    queryKey: ["todoList", `${queryVersion}`],
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
    reset({ title: todo.title, description: todo.description });
  };

  const onCloseAddModal = () => {
    setIsAddModalOpen(false);
  };
  const onOpenAddModal = () => {
    setIsAddModalOpen(true);
    reset({ title: "", description: "" });
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
        setQueryVersion((prev) => prev + 1);
      }
    } catch (error) {
      const errObj = error as AxiosError<IErrorResponse>;
      toast.error(`${errObj.response?.data.error.message}`, {
        position: "bottom-center",
      });
    }
  };
  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div className="flex items-center justify-center space-x-4 mb-8">
        <Button onClick={onOpenAddModal}>Post a new todo</Button>
        <Button
          variant={"outline"}
          onClick={() =>
            onGenerateTodos(userData?.jwt, setIsGenerating, setQueryVersion)
          }
          isLoading={isGenerating}
        >
          Generate Todos
        </Button>
      </div>
      {data.todos.length ? (
        data.todos.map((todo: ITodo) => (
          <div
            key={todo.documentId}
            className="flex items-center justify-between bg-white hover:bg-gray-50 p-5 rounded-xl shadow-sm border border-gray-100 transition-all duration-200 focus-within:ring-2 focus-within:ring-indigo-500 hover:shadow-md group"
          >
            <p className="w-full font-medium text-gray-800 text-lg">
              <span className="text-gray-400 mr-2 text-sm">#{todo.id}</span>
              {todo.title}
            </p>
            <div className="flex items-center justify-end gap-x-3 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
              <Button
                size={"sm"}
                onClick={() => onOpenEditModal(todo)}
                type={"button"}
              >
                Edit
              </Button>
              <Button
                variant={"danger"}
                size={"sm"}
                onClick={() => onOpenConfirmModal(todo)}
                type={"button"}
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
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Input
              {...register("title", { required: true })}
              placeholder="Title"
            />
            {errors.title?.type === "required" && (
              <InputErrorMessage message="this title is required" />
            )}
          </div>
          <div>
            <Textarea
              {...register("description", { minLength: 20 })}
              placeholder="Description"
              rows={7}
            />
            {errors.description?.type === "minLength" && (
              <InputErrorMessage message="this description must be at least 20 characters long" />
            )}
          </div>
          <div className="flex items-center justify-end space-x-3 mt-6">
            <Button
              variant={"cancel"}
              onClick={onCloseEditModal}
              type="button"
              fullWidth
            >
              Cancel
            </Button>
            <Button isLoading={isUpdating} type={"submit"} fullWidth>
              {isUpdating ? "Updating..." : "Update"}
            </Button>
          </div>
        </form>
      </Modal>

      {/*Add todo Modal */}
      <Modal
        isOpen={isAddModalOpen}
        close={onCloseAddModal}
        title="Add a new todo"
      >
        <form className="space-y-4" onSubmit={handleSubmit(onAddSubmit)}>
          <div>
            <Input
              {...register("title", { required: true })}
              placeholder="Title"
            />
            {errors.title?.type === "required" && (
              <InputErrorMessage message="this title is required" />
            )}
          </div>
          <div>
            <Textarea
              {...register("description", { minLength: 20 })}
              placeholder="Description"
              rows={7}
            />
            {errors.description?.type === "minLength" && (
              <InputErrorMessage message="this description must be at least 20 characters long" />
            )}
          </div>
          <div className="flex items-center justify-end space-x-3 mt-6">
            <Button
              variant={"cancel"}
              onClick={onCloseAddModal}
              type={"button"}
              fullWidth
            >
              Cancel
            </Button>
            <Button isLoading={isAdding} type={"submit"} fullWidth>
              {isAdding ? "Adding..." : "Add"}
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
        <div className="flex items-center justify-end space-x-3 mt-6">
          <Button
            variant="cancel"
            onClick={onCloseConfirmModal}
            type={"button"}
            fullWidth
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={onRemove} type={"submit"} fullWidth>
            Yes, Remove
          </Button>
        </div>
      </Modal>
    </div>
  );
};
export default TodoList;
