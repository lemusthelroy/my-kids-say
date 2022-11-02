import { useEffect, useState } from "react";
import { Entry, createClient } from "contentful";
import ReactMarkdown from "react-markdown";

interface IKidPost {
  title: string;
  body: string;
}

const client = createClient({
  space: process.env.REACT_APP_CONTENTFUL_SPACE as string,
  environment: "master", // defaults to 'master' if not set
  accessToken: process.env.REACT_APP_CONTENTFUL_ACCESS_TOKEN as string,
});

const shuffle = (array: Entry<IKidPost>[]) => {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex !== 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
};

const App = () => {
  const [entries, setEntries] = useState<Entry<IKidPost>[]>();

  const [currentEntry, setCurrentEntry] = useState<number>(0);

  const getNextQuote = () => {
    if (entries) {
      if (currentEntry + 1 >= entries.length) {
        setCurrentEntry(0);
      } else {
        setCurrentEntry(currentEntry + 1);
      }
    }
  };

  useEffect(() => {
    console.log("here");
    if (entries) {
      getNextQuote();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entries]);

  useEffect(() => {
    client
      .getEntries<IKidPost>()
      .then((response) => {
        setEntries(shuffle(response.items));
      })
      .catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex h-screen items-center align-middle w-full flex-col justify-center self-center">
      <div className="border-t-[1px] border-b-[1px] p-4 border-gray-400 mb-4">
        {entries && (
          <ReactMarkdown>
            {entries[currentEntry].fields.body ?? ""}
          </ReactMarkdown>
        )}
      </div>

      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
        onClick={getNextQuote}
      >
        Next
      </button>
    </div>
  );
};

export default App;
