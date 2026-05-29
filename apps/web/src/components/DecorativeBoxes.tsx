const patterns = {
  corner: [
    ["right-6 top-6", "horizontal"],
    ["right-16 top-14", "vertical"],
  ],
  edge: [
    ["left-6 top-8", "vertical"],
    ["left-16 top-20", "horizontal"],
  ],
  scatter: [
    ["right-10 bottom-10", "horizontal"],
    ["right-20 bottom-20", "vertical"],
  ],
  outsideTop: [
    ["left-2 top-2", "horizontal"],
    ["right-10 top-8", "vertical"],
  ],
  outsideSide: [
    ["left-0 top-1/3", "vertical"],
    ["right-2 bottom-16", "horizontal"],
  ],
} as const;

type DecorativeBoxesProps = {
  pattern?: keyof typeof patterns;
  className?: string;
};

export function DecorativeBoxes({ pattern = "corner", className = "" }: DecorativeBoxesProps) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-visible ${className}`} aria-hidden="true">
      {patterns[pattern].map(([anchor, direction]) => (
        <div key={`${anchor}-${direction}`} className={`absolute ${anchor}`}>
          <span className="absolute h-3 w-3 bg-[color:var(--accent)]" />
          <span
            className={`absolute h-3 w-3 bg-[color:var(--accent)] ${
              direction === "horizontal" ? "left-3 top-0" : "left-0 top-3"
            }`}
          />
        </div>
      ))}
    </div>
  );
}
