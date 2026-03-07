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
    <div className="max-w-3xl mx-auto space-y-3">
      <div className="flex items-center justify-between mb-5">
        <Button
          variant={"outline"}
          onClick={() =>
            onGenerateTodos(userData?.jwt, setIsGenerating, setQueryVersion)
          }
          isLoading={isGenerating}
        >
          Generate new todos
        </Button>
        <div className="flex items-center space-x-2">
          <select
            className="p-3 border border-gray-300 rounded-md text-center"
            value={pageSize}
            onChange={(e) => setPageSize(+e.target.value)}
          >
            <option disabled>Page Size</option>
            <option value={10}>10</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <select
            className="p-3 border border-gray-300 rounded-md text-center"
            value={sortedBy}
            onChange={(e) => {
              setSortedBy(e.target.value);
            }}
          >
            <option disabled>Sort By</option>
            <option value={"ASC"}>Oldest</option>
            <option value={"DESC"}>Newest</option>
          </select>
        </div>
      </div>
      {data.data.length ? (
        data.data.map(
          (
            {
              documentId,
              id,
              title,
            }: {
              id: number;
              documentId: string;
              title: string;
            },
            idx: number,
          ) => (
            <div
              key={documentId}
              className={
                idx % 2 === 0
                  ? "flex items-center justify-between p-3 rounded-md"
                  : "flex items-center bg-gray-100 justify-between p-3 rounded-md"
              }
            >
              <p className="w-full font-semibold text-lg">
                {id}- {title}
              </p>
            </div>
          ),
        )
      ) : (
        <h3 className="text-center text-lg">No todos yet!</h3>
      )}

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
