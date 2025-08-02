export const Loader = () => (
  <div className="w-full max-w-xl flex flex-col items-center justify-center gap-6 p-6 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-3xl shadow-2xl border border-indigo-200 min-h-[180px]">
    <div className="flex flex-col items-center gap-2">
      <svg
        className="animate-spin h-10 w-10 text-indigo-500"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        ></path>
      </svg>
      <span className="text-lg font-semibold text-indigo-700 mt-2">
        Processing... 🎤
      </span>
    </div>
  </div>
);
