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

export default InlineDiff;