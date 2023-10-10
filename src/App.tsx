import { useState } from "react";
import styles from "./App.module.css";

const unit = 100;
const containerHeight = 8 * unit;
const containerPadding = unit;
const rectHeight = 6 * unit;
const textAreaHeight = unit;

const useScroll = () => {
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(unit * 10);

  const toLeft = () => {
    setStart(Math.max(start - 100, 0));
    setEnd(Math.max(end - 100, 0));
  };

  const toRight = () => {
    setStart(start + 100);
    setEnd(end + 100);
  };

  return {
    start,
    end,
    toLeft,
    toRight,
  };
};

const getLines = (start: number, end: number) => {
  const s = Math.floor(start / unit) * unit + (start % unit) ? unit : 0;
  const e = Math.ceil(end / unit) * unit;
  const l = [];

  for (let i = s; i <= e; i += 100) {
    const text = (
      <text x={i} y={textAreaHeight / 2} key={`text-${i}`}>
        {i}
      </text>
    );
    const line = (
      <line
        x1={i}
        y1="0"
        x2={i}
        y2={containerHeight}
        key={`line-${i}`}
        stroke="black"
      ></line>
    );
    l.push(text);
    l.push(line);
  }
  return l;
};

const useRects = () => {
  const [state, setState] = useState<
    { start: number; end: number; type: string }[]
  >([]);

  const addRect = (start: number, end: number, type: string) => {
    setState([
      ...state,
      {
        start,
        end,
        type,
      },
    ]);
  };

  const removeRect = (index: number) => {
    setState(state.filter((_, i) => index != i));
  };

  return {
    rects: state,
    addRect,
    removeRect,
  };
};

const getRectElms = (rects: { start: number; end: number; type: string }[]) => {
  return rects.map((rect) => (
    <>
      <rect
        x={rect.start}
        width={rect.end - rect.start}
        y={textAreaHeight + containerPadding}
        height={rectHeight - containerPadding}
        key={rect.start}
        className={styles.rect}
        fill="orange"
        rx={20}
        ry={20}
      ></rect>
      <text
        x={rect.start + 10}
        y={textAreaHeight + containerHeight / 2}
        fill="white"
      >
        {rect.type}
      </text>
    </>
  ));
};

function App() {
  const { start, end, toLeft, toRight } = useScroll();
  const lines = getLines(start, end);
  const { rects, addRect, removeRect } = useRects();

  return (
    <>
      <div>
        <section className={styles.body}>
          <svg
            viewBox={`${start} ${-textAreaHeight} ${unit * 10} ${
              containerHeight + textAreaHeight
            }`}
            className={styles.canvas}
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
          >
            <line
              x1={start}
              x2={start + unit * 10}
              y1={textAreaHeight}
              y2={textAreaHeight}
              stroke="black"
            ></line>
            {lines}
            {getRectElms(rects)}
          </svg>
          <button
            className={`${styles.scrollButton} ${styles.prev}`}
            onClick={() => {
              toLeft();
            }}
            disabled={start == 0}
          >
            ←
          </button>
          <button
            className={`${styles.scrollButton} ${styles.next}`}
            onClick={() => {
              toRight();
            }}
          >
            →
          </button>
          <button
            className={styles.addrect}
            onClick={() => {
              const s = Number.parseInt(prompt("開始時間") ?? "0");
              const e = Number.parseInt(prompt("終了時間") ?? "0");
              const t = prompt("タイプ");

              if (s == e) return;
              if (t == null) return;

              addRect(s, e, t);
            }}
          >
            New
          </button>
        </section>
      </div>
    </>
  );
}

export default App;
