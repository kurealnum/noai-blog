import { Dialog } from "@mui/material";

function ConfirmationModal({ toCallFunction, message, isOpen, toCallArgs }) {
  return (
    <Dialog open={isOpen}>
      <h2>Hey!</h2>
      <p>{message}</p>
      <button onClick={() => toCallFunction(...toCallArgs)}>
        Are you sure?
      </button>
    </Dialog>
  );
}

export default ConfirmationModal;
