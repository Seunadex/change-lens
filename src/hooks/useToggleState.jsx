import { useState } from "react";
const useToggleState = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);

  const handleToggle = () => {
    setIsOpen((prevState) => !prevState)
  };

  return { isOpen, handleToggle }
};

export default useToggleState;
