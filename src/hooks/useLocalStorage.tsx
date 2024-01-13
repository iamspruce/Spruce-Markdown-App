import React from "react";

function useLocalStorage(defaultValue: string, key: string) {
  const [value, setValue] = React.useState(() => {
    const stickyValue =
      typeof window !== "undefined" &&
      (window as any).localStorage.getItem(key);
    return stickyValue !== null ? JSON.parse(stickyValue) : defaultValue;
  });
  React.useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue];
}

export { useLocalStorage };
