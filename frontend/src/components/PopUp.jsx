import { useEffect, useState } from "react";

function PopUp({ children, popUpId = "", timesToShowPopUp }) {
  // Only show once per page load
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Determines whether the user has seen the pop up too many times
    const hash = "byeai_popUpViewCount_" + popUpId;
    const isPopUpViewCount = localStorage.getItem(hash);
    if (isPopUpViewCount != null) {
      // If isPopUpViewCount isn't null, then it's a number
      const popUpViewCount = Number(isPopUpViewCount);
      localStorage.setItem(hash, popUpViewCount + 1);
      if (popUpViewCount <= timesToShowPopUp && !isOpen) {
        setIsOpen(true);
      }
    } else {
      localStorage.setItem(hash, 1);
      setIsOpen(true);
    }
  }, []);
  // The empty dependency array is intentional -- we want this to run once per render.

  return (
    <dialog className="pop-up" open={isOpen}>
      {children}
      <button onClick={() => setIsOpen(false)} autoFocus>
        Close
      </button>
    </dialog>
  );
}

export default PopUp;
