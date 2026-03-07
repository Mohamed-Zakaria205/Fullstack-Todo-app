import { useState } from "react";
import Paginator from "../components/ui/Paginator";
import useAuthenticatedQuery from "../hooks/useAuthenticatedQuery";
import Button from "../components/ui/Button";
import { onGenerateTodos } from "../utils/functions";

// Handlers
const TodosPage = () => {
  const storageKey = "loggedInUser";
  const userDataString = localStorage.getItem(storageKey);
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const [isGenerating, setIsGenerating] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [sortedBy, setSortedBy] = useState<string>("DESC");
  const [queryVersion, setQueryVersion] = useState(1);

  const { data, isLoading, isFetching } = useAuthenticatedQuery({
    url: `/todos?pagination[page]=${page}&pagination[pageSize]=${pageSize}&sort=createdAt:${sortedBy}`,
    queryKey: [`todo-page-${page}-${pageSize}-${sortedBy}-${queryVersion}`],
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
          <div
            role="status"
            className="max-w-3xl mx-auto p-4 border border-default divide-y divide-default rounded-base shadow-xs animate-pulse md:p-6"
            key={idx}
          >
            <div className="flex items-center justify-between pb-4">
              <div>
                <div className="h-2.5 bg-neutral-quaternary rounded-full w-24 mb-2.5"></div>
                <div className="w-32 h-2 bg-neutral-quaternary rounded-full"></div>
              </div>
              <div className="h-2.5 bg-default rounded-full w-12"></div>
            </div>
          </div>
        ))}
      </>
    );
  }

  /**Handlers */

  const onClickPrevious = () => {
    setPage((prev) => prev - 1);
  };
  const onClickNext = () => {
    setPage((prev) => prev + 1);
  };
  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <Button
          onClick={() =>
            onGenerateTodos(userData?.jwt, setIsGenerating, setQueryVersion)
          }
          isLoading={isGenerating}
        >
          Generate new todos
        </Button>
        <div className="flex items-center space-x-3">
          <select
            className="block w-full border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 rounded-lg shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-colors duration-200 cursor-pointer"
            value={pageSize}
            onChange={(e) => setPageSize(+e.target.value)}
          >
            <option disabled>Page Size</option>
            <option value={10}>10 items</option>
            <option value={50}>50 items</option>
            <option value={100}>100 items</option>
          </select>
          <select
            className="block w-full border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 rounded-lg shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-colors duration-200 cursor-pointer"
            value={sortedBy}
            onChange={(e) => {
              setSortedBy(e.target.value);
            }}
          >
            <option disabled>Sort By</option>
            <option value={"ASC"}>Oldest first</option>
            <option value={"DESC"}>Newest first</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.data.length ? (
          data.data.map(
            ({
              documentId,
              id,
              title,
            }: {
              id: number;
              documentId: string;
              title: string;
            }) => (
              <div
                key={documentId}
                className="flex flex-col justify-center bg-white hover:bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md h-full"
              >
                <p className="font-medium text-gray-800 text-lg line-clamp-2">
                  <span className="text-gray-400 mr-2 text-sm">#{id}</span>
                  {title}
                </p>
              </div>
            ),
          )
        ) : (
          <h3 className="text-center text-lg text-gray-500 col-span-full py-10">
            No todos yet!
          </h3>
        )}
      </div>

      <Paginator
        page={page}
        pageCount={data.meta.pagination.pageCount}
        total={data.meta.pagination.total}
        isLoading={isLoading || isFetching}
        onClickNext={onClickNext}
        onClickPrevious={onClickPrevious}
      />
    </div>
  );
};

export default TodosPage;
