import { Dialog } from "@mui/material";

function ConfirmationModal({
  helperFunction,
  message,
  isOpen,
  helperFunctionArgs = [],
  toggleOpen,
}) {
  return (
    <Dialog open={isOpen} className="confirmation-modal" onClose={toggleOpen}>
      <h1>{message}</h1>
      <button
        onClick={() => helperFunction(...helperFunctionArgs)}
        className="accent-border"
      >
        Yes, I am sure
      </button>
      <button onClick={toggleOpen} className="tertiary-border">
        No, I'm not
      </button>
    </Dialog>
  );
}

export default ConfirmationModal;
