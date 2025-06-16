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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 whitespace-pre-wrap">
      <div className="rounded-lg border border-slate-300 shadow-sm bg-white">
        <h5 className="bg-slate-100 text-slate-700 px-4 py-2 rounded-t-lg font-semibold text-sm border-b">Content 1</h5>
        <div className="p-4 min-h-[120px] max-h-[400px] overflow-auto text-sm leading-relaxed">
          {left}
        </div>
      </div>
      <div className="rounded-lg border border-slate-300 shadow-sm bg-white">
        <h5 className="bg-slate-100 text-slate-700 px-4 py-2 rounded-t-lg font-semibold text-sm border-b">Content 2</h5>
        <div className="p-4 min-h-[120px] max-h-[400px] overflow-auto text-sm leading-relaxed">
          {right}
        </div>
      </div>
    </div>
  );
};

export default OutputDiff;
