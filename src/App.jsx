import { useState, useEffect } from "react";
import { diffChars } from "diff";
import { v4 as uuidV4 } from "uuid";
import "./App.css";
import OutputDiff from "./components/OutputDiff";
import InlineDiff from "./components/InlineDiff";
import useToggleState from "./hooks/useToggleState";
import SessionDeleteConfirmation from "./components/SessionDeleteConfirmation";

const MAX_LENGTH = 3000;
const MAX_LENGTH_WITH_SUMMARY = 600;
const SESSION_KEY = "summarize-history";
const DEFAULT_STATE = {
  contentOne: "",
  contentTwo: "",
};

const App = () => {
  const [contents, setContents] = useState(DEFAULT_STATE);
  const { contentOne, contentTwo } = contents;
  const [diffResult, setDiffResult] = useState([]);
  const [sessions, setSessions] = useState({});
  const [activeSession, setActiveSession] = useState("");

  const { isOpen, handleToggle } = useToggleState();
  const { isOpen: includeSummary, handleToggle: setIncludeSummary } =
    useToggleState();
  const { isOpen: isInline, handleToggle: setIsInline } = useToggleState();
  const { isOpen: showInfo, handleToggle: handleShowInfo } = useToggleState();

  const handleContentChange = (event, name) => {
    const length = includeSummary ? MAX_LENGTH_WITH_SUMMARY : MAX_LENGTH;
    if (event.target.value.length > length) return;
    setContents({
      ...contents,
      [name]: event.target.value,
    });
  };

  useEffect(() => {
    const saved = localStorage.getItem(SESSION_KEY);
    setSessions(JSON.parse(saved) || []);
  }, []);

  const loadSession = (id) => {
    const session = sessions[id];
    if (!session) return;
    const { contentOne, contentTwo, diffResult } = session;

    setContents({
      contentOne,
      contentTwo,
    });
    setDiffResult(diffResult);
    setActiveSession(id);
  };

  const saveSession = (session, id = null) => {
    const sessionId = id || uuidV4();
    const newSessions = {
      ...sessions,
      [sessionId]: {
        id: sessionId,
        ...session,
        createdAt: new Date().toISOString(),
      },
    };
    setSessions(newSessions);
    localStorage.setItem(SESSION_KEY, JSON.stringify(newSessions));
  };

  const handleDeleteSession = (id) => {
    const newSessions = { ...sessions };
    delete newSessions[id];
    setSessions(newSessions);
    localStorage.setItem(SESSION_KEY, JSON.stringify(newSessions));
    if (id === activeSession) {
      setActiveSession("");
    }
    handleToggle();
  };

  const handleCompareAndSummarize = () => {
    if (!contentOne.length && !contentTwo.length) return;
    const result = diffChars(contentOne, contentTwo);
    setDiffResult(result);
    saveSession({
      contentOne,
      contentTwo,
      diffResult: result,
    });
    if (includeSummary) {
      // summarizeDiff();
    }
  };

  const handleReset = () => {
    setContents(DEFAULT_STATE);
    setDiffResult([]);
    setActiveSession("");
  };

  return (
    <div className="mb-20">
      <SessionDeleteConfirmation
        isOpen={isOpen}
        handleToggle={handleToggle}
        handleDelete={() => handleDeleteSession(activeSession)}
      />
      <header className="text-center p-10 bg-gray-100 border-b border-gray-300">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Summarize It</h1>
        <h3 className="text-lg text-gray-600">
          AI-powered text comparison with human-friendly summaries.
        </h3>
        {!!Object.keys(sessions).length && (
          <div className="flex justify-center">
            <select
              name="sessions"
              onChange={(e) => loadSession(e.target.value)}
              value={activeSession}
              className="m-3 appearance-auto bg-gray-50 p-2 px-3 rounded-2xl text-sm"
            >
              <option value="">-- Select a session --</option>
              {Object.values(sessions).map((s) => (
                <option key={s.id} value={s.id} className="">
                  {new Date(s.createdAt).toLocaleString()}
                </option>
              ))}
            </select>
            {activeSession && (
              <button
                type="button"
                className="p-2 my-2 rounded-xl cursor-pointer bg-red-50 text-red-500 hover:bg-sky-100"
                onClick={handleToggle}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m-7 0a1 1 0 011-1h4a1 1 0 011 1m-7 0h8"
                  />
                </svg>
              </button>
            )}
          </div>
        )}
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
              {contentOne.length}/
              {includeSummary ? MAX_LENGTH_WITH_SUMMARY : MAX_LENGTH}
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
              {contentTwo.length}/
              {includeSummary ? MAX_LENGTH_WITH_SUMMARY : MAX_LENGTH}
            </p>
          </article>
        </section>
        <div className="flex justify-between relative">
          <div className="flex flex-col md:flex-row">
            <button
              className="px-4 py-1 my-4 rounded-xl cursor-pointer text-sky-50 bg-sky-500 hover:bg-sky-700 sm:text-xs"
              onClick={handleCompareAndSummarize}
            >
              {includeSummary ? "Compare and Summarize" : "Compare Texts"}
            </button>
            <label
              className="inline-flex items-center cursor-pointer px-2"
              onMouseEnter={() => handleShowInfo(false)}
              onMouseLeave={() => handleShowInfo(true)}
              onTouchStart={() => handleShowInfo(false)}
              onTouchEnd={() => handleShowInfo(true)}
            >
              <input
                type="checkbox"
                value=""
                className="sr-only peer"
                checked={includeSummary}
                onChange={(e) => setIncludeSummary(e.target.checked)}
              />
              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-500"></div>
              <span className="ms-3 text-sm font-medium text-gray-600">
                Include Summary
              </span>
            </label>
            {showInfo && (
              <div className="absolute bottom-14 left-15 z-10 inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-xs tooltip dark:bg-gray-700 sm:text-xs">
                Note: Including summary reduces the amount of content allowed.
              </div>
            )}
          </div>
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
                  className="cursor-pointer bg-gray-200 p-1 rounded-2xl"
                  onClick={() => setIsInline(false)}
                  title="View split mode"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 4H6a2 2 0 00-2 2v12a2 2 0 002 2h4M14 4h4a2 2 0 012 2v12a2 2 0 01-2 2h-4"
                    />
                  </svg>
                </button>
              ) : (
                <button
                  type="button"
                  className="cursor-pointer bg-gray-200 p-1 rounded-2xl"
                  onClick={() => setIsInline(true)}
                  title="View inline mode"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
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
    </div>
  );
};

export default App;
