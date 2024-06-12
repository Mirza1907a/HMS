import React, { useState, useEffect } from "react";

const CountdownToast = ({ initialCount, onCountdownEnd }) => {
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    if (count > 0) {
      const timer = setTimeout(() => setCount(count - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      onCountdownEnd();
    }
  }, [count, onCountdownEnd]);

  return <span>You&apos;ll be logged out in {count} seconds.</span>;
};

export default CountdownToast;
