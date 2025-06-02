import { useState } from "react";
import "./App.css";

const MAX_LENGTH = 550;

const App = () => {
  const [contents, setContents] = useState({
    contentOne: "",
    contentTwo: "",
  });

  const handleContentChange = (event, name) => {
    if (event.target.value.length > MAX_LENGTH) return;
    setContents({
      ...contents,
      [name]: event.target.value
    })
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
              value={contents.contentOne}
              onChange={(event) => handleContentChange(event, 'contentOne')}
              className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
            />
            <p>{contents.contentOne.length}/{MAX_LENGTH}</p>
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
              value={contents.contentTwo}
              onChange={(event) => handleContentChange(event, 'contentTwo')}
              className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
            />
            <p>{contents.contentTwo.length}/{MAX_LENGTH}</p>
          </article>
        </section>
        <button className="px-4 py-1 my-4 rounded-xl cursor-pointer text-sky-50 bg-sky-500 hover:bg-sky-700">Compare</button>
      </main>
    </>
  );
};

export default App;
