import React, { useState } from "react";

const Counter = () => {
  const [number, setNumber] = useState(0);

  // const numberState = useState(0);
  // const number = numberState[0];
  // const setNumber = numberState[1];

  const onIncrease = () => {
    // setNumber(number + 1);
    setNumber((pN) => pN + 1);
    console.log("+1");
  };

  const onDecrease = () => {
    // setNumber(number - 1);
    setNumber((pN) => pN - 1);
    console.log("-1");
  };

  return (
    <div>
      <h1>{number}</h1>
      <button onClick={onIncrease}>+1</button>
      <button onClick={onDecrease}>-1</button>
    </div>
  );
};

export default Counter;
