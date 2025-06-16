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

const formatDate = (dateString) => {
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };
  return new Date(dateString).toLocaleString(undefined, options);
};

const App = () => {
  const [contents, setContents] = useState(DEFAULT_STATE);
  const { contentOne, contentTwo } = contents;
  const [diffResult, setDiffResult] = useState([]);
  const [summaryResult, setSummaryResult] = useState({});
  const [sessions, setSessions] = useState({});
  const [activeSession, setActiveSession] = useState("");
  const [isSummarizing, setIsSummarizing] = useState(false);

  const { isOpen: isDeleteConfirmOpen, handleToggle: toggleDeleteConfirm } = useToggleState();
  const { isOpen: includeSummary, handleToggle: toggleIncludeSummary } = useToggleState();
  const { isOpen: isInline, handleToggle: toggleInlineView } = useToggleState();
  const { isOpen: showInfo, handleToggle: toggleShowInfo } = useToggleState();

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
    const { contentOne, contentTwo, diffResult, summaryResult } = session;

    setContents({
      contentOne,
      contentTwo,
    });
    setDiffResult(diffResult);
    setActiveSession(id);
    setSummaryResult(summaryResult);
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
    toggleDeleteConfirm();
  };

  const compareTexts = () => {
    if (!contentOne.length && !contentTwo.length) return null;
    return diffChars(contentOne, contentTwo);
  };

  const handleCompareAndSummarize = () => {
    const result = compareTexts();
    if (!result) return;
    setDiffResult(result);
    saveSession({
      contentOne,
      contentTwo,
      diffResult: result,
    });
    if (includeSummary) {
      summarizeDiff();
    }
  };

  const summarizeDiff = async () => {
    setIsSummarizing(true);
    try {
      const response = await fetch("/.netlify/functions/summarizeDiff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentOne, contentTwo }),
      });

      if (!response.ok) {
        setIsSummarizing(false);
        throw new Error(`Server error: ${response.status}`);
      }

      const result = await response.json();
      setSummaryResult(result);
      setIsSummarizing(false);
      saveSession(
        {
          contentOne,
          contentTwo,
          diffResult,
          summaryResult: result,
        },
        activeSession
      );
    } catch (error) {
      console.error("Error summarizing diff:", error);
      setIsSummarizing(false);
    }
  };

  const handleReset = () => {
    setContents(DEFAULT_STATE);
    setDiffResult([]);
    setActiveSession("");
    setSummaryResult({});
  };

  return (
    <div className="mb-20">
      <SessionDeleteConfirmation
        isOpen={isDeleteConfirmOpen}
        handleToggle={toggleDeleteConfirm}
        handleDelete={() => handleDeleteSession(activeSession)}
      />
      <header className="text-center p-10 bg-gray-100 border-b border-gray-300">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">ChangeLens</h1>
        <h3 className="text-lg text-gray-600 italic">
          Smart text comparison with clear summaries and change significance -- powered by AI.
        </h3>
        {!!Object.keys(sessions).length && (
          <div className="flex justify-center">
            <select
              name="sessions"
              onChange={(e) => loadSession(e.target.value)}
              value={activeSession}
              className="m-3 appearance-auto bg-gray-50 p-2 px-3 rounded-2xl text-sm"
            >
              <option value="" className="text-gray-600">-- Select a session --</option>
              {Object.values(sessions).map((s) => (
                <option key={s.id} value={s.id} className="">
                  {formatDate(s.createdAt)}
                </option>
              ))}
            </select>
            {activeSession && (
              <button
                type="button"
                className="p-2 my-2 rounded-xl cursor-pointer bg-red-50 text-red-500 hover:bg-sky-100"
                onClick={toggleDeleteConfirm}
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
              className="w-full p-4 text-sm text-gray-800 bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors resize-none placeholder:text-gray-400"
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
              className="w-full p-4 text-sm text-gray-800 bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors resize-none placeholder:text-gray-400"
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
              onMouseEnter={() => toggleShowInfo(false)}
              onMouseLeave={() => toggleShowInfo(true)}
              onTouchStart={() => toggleShowInfo(false)}
              onTouchEnd={() => toggleShowInfo(true)}
            >
              <input
                type="checkbox"
                value=""
                className="sr-only peer"
                checked={includeSummary}
                onChange={(e) => toggleIncludeSummary(e.target.checked)}
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
        {isSummarizing ? (
          <div className="animate-pulse text-center my-4 text-gray-500">
            Summarizing changes...
          </div>
        ) : (
          summaryResult?.summary && (
            <div className="bg-white border border-blue-100 shadow-md rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Summary of Changes
              </h3>
              <p className="text-gray-700 mb-3">{summaryResult.summary}</p>
              <span
                className={`inline-block px-3 py-1 text-sm rounded-full font-medium ${
                  summaryResult.significance === "critical"
                    ? "bg-red-100 text-red-700"
                    : summaryResult.significance === "major"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                Significance: {summaryResult.significance}
              </span>
            </div>
          )
        )}
        {!!diffResult.length && (
          <section className="bg-white p-4 rounded-lg border-blue-100 border shadow-md">
            <div className="flex justify-between items-baseline">
              <h4 className="text-lg font-semibold mb-4 text-gray-800">
                Diff Output
              </h4>
              {isInline ? (
                <button
                  type="button"
                  className="cursor-pointer bg-gray-200 p-1 rounded-2xl"
                  onClick={() => toggleInlineView(false)}
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
                  onClick={() => toggleInlineView(true)}
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
