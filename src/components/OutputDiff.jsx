import { useMemo } from "react";

const OutputDiff = ({ result }) => {
  const { left, right } = useMemo(() => {
    const left = [];
    const right = [];

    result.forEach((part, index) => {
      if (part.removed) {
        left.push(
          <span key={`l-${index}`} className="bg-red-200 text-red-900">
            {part.value}
          </span>
        );
      } else if (part.added) {
        right.push(
          <span key={`r-${index}`} className="bg-green-200 text-green-900">
            {part.value}
          </span>
        );
      } else {
        left.push(<span key={`l-${index}`}>{part.value}</span>);
        right.push(<span key={`r-${index}`}>{part.value}</span>);
      }
    });

    return { left, right };
  }, [result]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 whitespace-pre-wrap">
      <div>
        <h5 className="mb-2">Content 1</h5>
        <div className="p-4 border border-gray-400 rounded-lg bg-gray-50 min-h-[100px]">
          {left}
        </div>
      </div>
      <div>
        <h5 className="mb-2">Content 2</h5>
        <div className="p-4 border border-gray-400 rounded-lg bg-gray-50 min-h-[100px]">
          {right}
        </div>
      </div>
    </div>
  );
};

export default OutputDiff;
