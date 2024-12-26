import { CircularProgress } from "@mui/material";

// this is just here because we're using custom css
function LoadingIcon() {
  return (
    <CircularProgress
      sx={{
        position: "absolute",
        left: "0",
        right: "0",
        top: "0",
        bottom: "0",
        margin: "auto",
      }}
    />
  );
}

export default LoadingIcon;
