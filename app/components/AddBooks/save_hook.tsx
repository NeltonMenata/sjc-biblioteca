import { useState } from "react";

export default function useSaveState() {
  //isSave, initSave, closeSave
  const [isSave, setIsSave] = useState(false);
  function initSave() {
    setIsSave(true);
  }
  function closeSave() {
    setIsSave(false);
  }
  return {
    initSave,
    closeSave,
    isSave,
  };
}
