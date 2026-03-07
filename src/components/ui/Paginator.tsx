interface IProps {
  page: number;
  pageCount: number;
  total: number;
  isLoading: boolean;
  onClickPrevious: () => void;
  onClickNext: () => void;
}

const Paginator = ({
  page = 1,
  pageCount,
  total,
  isLoading,
  onClickNext,
  onClickPrevious,
}: IProps) => {
  return (
    <div className="flex flex-col justify-center items-center space-y-6 my-10 font-sans">
      <p className="text-sm text-gray-600 mx-3">
        Showing Page
        <span className="mx-1.5 font-bold text-gray-900">{page}</span>
        to
        <span className="mx-1.5 font-bold text-gray-900">{pageCount}</span>
        of
        <span className="mx-1.5 font-bold text-gray-900">{total}</span>
        Records
      </p>

      <div className="inline-flex rounded-lg shadow-sm">
        <button
          type="button"
          className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-50 hover:text-indigo-600 focus:z-10 focus:ring-2 focus:ring-indigo-500 focus:text-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
          disabled={page === 1 || isLoading}
          onClick={onClickPrevious}
        >
          <svg
            className="w-4 h-4 mr-2"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Previous
        </button>
        <button
          type="button"
          className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-l-0 border-gray-300 rounded-r-lg hover:bg-gray-50 hover:text-indigo-600 focus:z-10 focus:ring-2 focus:ring-indigo-500 focus:text-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
          disabled={page === pageCount || isLoading}
          onClick={onClickNext}
        >
          Next
          <svg
            className="w-4 h-4 ml-2"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Paginator;
