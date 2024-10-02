import { useEffect } from "react";

const useDisableShortcuts = () => {
  useEffect(() => {
    const disableShortcuts = (e) => {
      const forbiddenKeys = ["Alt", "Tab", "F4", "Escape", "F11"];
      if (forbiddenKeys.includes(e.key) || e.ctrlKey || e.altKey || e.metaKey) {
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", disableShortcuts);

    return () => {
      window.removeEventListener("keydown", disableShortcuts);
    };
  }, []);
};

export default useDisableShortcuts;
