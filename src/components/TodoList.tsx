import Button from "./ui/Button";
import useAuthenticatedQuery from "../hooks/useAuthenticatedQuery";
import { useState } from "react";
import Modal from "./ui/Modal";
import { Input, Textarea } from "@headlessui/react";
import { IErrorResponse, ITodo } from "../interfaces";
import { axiosInstance } from "../config";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useForm, SubmitHandler } from "react-hook-form";
import InputErrorMessage from "./ui/InputErrorMessage";
import TodoSkeleton from "./TodoSkeleton";
import { faker } from "@faker-js/faker";

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

  const onGenerateTodos = async () => {
    for (let index = 0; index < 100; index++) {
      setIsGenerating(true);
      try {
        await axiosInstance.post(
          `/todos`,
          {
            data: {
              title: faker.word.words(5),
              description: faker.lorem.sentences(3),
            },
          },
          {
            headers: {
              Authorization: `Bearer ${userData?.jwt}`,
            },
          },
        );
      } catch (error) {
        console.log(error);
      } finally {
        setIsGenerating(false);
      }
    }
    setQueryVersion((prev) => prev + 1);
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
    <div className="max-w-lg mx-auto space-y-3">
      <div className="flex items-center">
        <Button
          className="mx-auto bg-indigo-600 hover:bg-indigo-300 hover:text-black mb-10"
          onClick={onOpenAddModal}
        >
          Post a new todo
        </Button>
        <Button
          className="mx-auto bg-indigo-600 hover:bg-indigo-300 hover:text-black mb-10"
          onClick={onGenerateTodos}
          isLoading={isGenerating}
        >
          Generate Todos
        </Button>
      </div>
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
                type={"button"}
              >
                Edit
              </Button>
              <Button
                className="bg-red-500 hover:bg-red-300 hover:text-black"
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            {...register("title", { required: true })}
            className="w-full p-4 border border-gray-300 rounded-md"
          />
          {errors.title?.type === "required" && (
            <InputErrorMessage message="this title is required" />
          )}
          <Textarea
            {...register("description", { minLength: 20 })}
            className="w-full p-4 border border-gray-300 rounded-md mt-4"
            placeholder="Description"
            rows={7}
          />
          {errors.description?.type === "minLength" && (
            <InputErrorMessage message="this description must be at least 20 characters long" />
          )}
          <div className="flex items-center  space-x-2 mt-4">
            <Button
              className="bg-indigo-700 hover:bg-indigo-800"
              isLoading={isUpdating}
              type={"submit"}
            >
              {isUpdating ? "Updating..." : "Update"}
            </Button>
            <Button variant={"cancel"} onClick={onCloseEditModal} type="button">
              Cancel
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
        <form onSubmit={handleSubmit(onAddSubmit)}>
          <Input
            {...register("title", { required: true })}
            className="w-full p-4 border border-gray-300 rounded-md"
            placeholder="Title"
          />
          {errors.title?.type === "required" && (
            <InputErrorMessage message="this title is required" />
          )}
          <Textarea
            {...register("description", { minLength: 20 })}
            className="w-full p-4 border border-gray-300 rounded-md mt-4"
            placeholder="Description"
            rows={7}
          />
          {errors.description?.type === "minLength" && (
            <InputErrorMessage message="this description must be at least 20 characters long" />
          )}
          <div className="flex items-center  space-x-2 mt-4">
            <Button
              className="bg-indigo-700 hover:bg-indigo-800"
              isLoading={isAdding}
              type={"submit"}
            >
              {isAdding ? "Adding..." : "Add"}
            </Button>
            <Button
              variant={"cancel"}
              onClick={onCloseAddModal}
              type={"button"}
            >
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
            type={"submit"}
          >
            Yes, Remove
          </Button>
          <Button
            className="bg-gray-400 hover:bg-gray-200 hover:text-black"
            onClick={onCloseConfirmModal}
            fullWidth
            type={"button"}
          >
            Cancel
          </Button>
        </div>
      </Modal>
    </div>
  );
};
export default TodoList;
