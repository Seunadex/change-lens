import { useState } from "react";
import { diffChars } from "diff";
import "./App.css";
import OutputDiff from "./components/OutputDiff";

const MAX_LENGTH = 550;
const DEFAULT_STATE = {
  contentOne: "",
  contentTwo: "",
};

const InlineDiff = ({ result }) => {
  return (
    <div className="font-mono whitespace-pre-wrap">
      {result.map((part, index) => {
        const className = part.added
          ? "bg-green-200 text-green-900"
          : part.removed
          ? "bg-red-200 text-red-900"
          : "";
        return (
          <span key={index} className={className}>
            {part.value}
          </span>
        );
      })}
    </div>
  );
};

const App = () => {
  const [contents, setContents] = useState(DEFAULT_STATE);
  const [diffResult, setDiffResult] = useState([]);
  const [isInline, setIsInline] = useState(false);

  const { contentOne, contentTwo } = contents;

  const handleContentChange = (event, name) => {
    if (event.target.value.length > MAX_LENGTH) return;
    setContents({
      ...contents,
      [name]: event.target.value,
    });
  };

  const handleCompare = () => {
    const result = diffChars(contentOne, contentTwo);
    setDiffResult(result);
  };

  const handleReset = () => {
    setContents(DEFAULT_STATE);
    setDiffResult([]);
  };

  return (
    <>
      <header className="text-center p-10 bg-gray-100 border-b border-gray-300">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Summarize It</h1>
        <h3 className="text-lg text-gray-600">
          AI-powered text comparison with human-friendly summaries.
        </h3>
      </header>

      <main className="p-8 max-w-6xl mx-auto">
        <section className="flex flex-col md:flex-row gap-6">
          <article className="flex-1">
            <label
              htmlFor="content-one"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Content 1
            </label>
            <textarea
              id="content-one"
              name="content-one"
              rows="10"
              value={contentOne}
              onChange={(event) => handleContentChange(event, "contentOne")}
              placeholder="Enter previous content here..."
              className="w-full p-3 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
            />
            <p className="text-sm place-self-end text-gray-500">
              {contentOne.length}/{MAX_LENGTH}
            </p>
          </article>

          <article className="flex-1">
            <label
              htmlFor="content-two"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Content 2
            </label>
            <textarea
              id="content-two"
              name="content-two"
              rows="10"
              value={contentTwo}
              onChange={(event) => handleContentChange(event, "contentTwo")}
              placeholder="Enter current content here..."
              className="w-full p-3 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
            />
            <p className="text-sm place-self-end text-gray-500">
              {contentTwo.length}/{MAX_LENGTH}
            </p>
          </article>
        </section>
        <div className="grid grid-cols-2 gap-4">
          <button
            className="px-4 py-1 my-4 rounded-xl cursor-pointer text-sky-50 bg-sky-500 hover:bg-sky-700"
            onClick={handleCompare}
          >
            Compare and Summarize
          </button>
          <button
            className="px-4 py-1 my-4 rounded-xl cursor-pointer bg-sky-50 text-sky-500 hover:bg-sky-100"
            onClick={handleReset}
          >
            Reset
          </button>
        </div>
        {!!diffResult.length && (
          <section className="bg-white p-6 rounded-lg shadow-xl/30">
            <div className="flex justify-between items-baseline">
              <h4 className="text-xl font-medium mb-4">Diff Output</h4>
              {isInline ? (
                <button
                  type="button"
                  className="cursor-pointer"
                  onClick={() => setIsInline(false)}
                  title="View split mode"
                >
                  <svg
                    className="w-5 h-5 text-gray-800 dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M1 5h1.424a3.228 3.228 0 0 0 6.152 0H19a1 1 0 1 0 0-2H8.576a3.228 3.228 0 0 0-6.152 0H1a1 1 0 1 0 0 2Zm18 4h-1.424a3.228 3.228 0 0 0-6.152 0H1a1 1 0 1 0 0 2h10.424a3.228 3.228 0 0 0 6.152 0H19a1 1 0 0 0 0-2Zm0 6H8.576a3.228 3.228 0 0 0-6.152 0H1a1 1 0 0 0 0 2h1.424a3.228 3.228 0 0 0 6.152 0H19a1 1 0 0 0 0-2Z" />
                  </svg>
                </button>
              ) : (
                <button
                  type="button"
                  className="cursor-pointer"
                  onClick={() => setIsInline(true)}
                  title="View inline mode"
                >
                  <svg
                    className="w-5 h-5 text-gray-800 dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 12.25V1m0 11.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M4 19v-2.25m6-13.5V1m0 2.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M10 19V7.75m6 4.5V1m0 11.25a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM16 19v-2"
                    />
                  </svg>
                </button>
              )}
            </div>
            {isInline ? (
              <InlineDiff result={diffResult} />
            ) : (
              <OutputDiff result={diffResult} />
            )}
          </section>
        )}
      </main>
    </>
  );
};

export default App;
