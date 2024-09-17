import { useEffect, useState } from "react";
import { Outlet, useRouteLoaderData } from "react-router-dom";
import { Alert, Snackbar } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Modal from "@mui/material/Modal";
import "../styles/Settings.css";
import ErrorMessage from "../components/ErrorMessage";
import {
  getLinks,
  deleteLink,
  createLink,
  changeSettings,
} from "../features/helpers";

function Settings() {
  const userData = useRouteLoaderData("root");

  // removing the image path from data
  delete userData["profile_picture"];

  const [newUserData, setNewUserData] = useState(userData);
  const [newLinks, setNewLinks] = useState([]);
  const [singleNewLink, setSingleNewLink] = useState({});
  const [isSaved, setIsSaved] = useState(false);
  const [profilePicture, setProfilePicture] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // modal error
  const [error, setError] = useState(false);
  // snackbar error
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    getLinks().then((res) => {
      setNewLinks(res);
    });
  }, []);

  const handleOpen = () => setIsModalOpen(true);
  const handleClose = () => {
    setIsModalOpen(false);
    setError(false);
  };

  function setNewUserDataHelper(e) {
    setNewUserData({ ...newUserData, [e.target.name]: e.target.value });
  }

  function setProfilePictureHelper(e) {
    setProfilePicture({
      [e.target.name]: e.target.files[0],
    });
  }

  function setSingleNewLinkHelper(e) {
    setSingleNewLink({ ...singleNewLink, [e.target.name]: e.target.value });
  }

  function setNewLinksHelper(e, index) {
    const newLinksTemp = newLinks;
    newLinksTemp[index] = {
      ...newLinks[index],
      [e.target.name]: e.target.value,
    };
    setNewLinks(newLinksTemp);
  }

  function removeNewLinksHelper(index) {
    const updatedLinks = newLinks.filter((value, i) => i !== index);

    setNewLinks(updatedLinks);
    deleteLink(newLinks[index]);
  }

  function addNewLinksHelper() {
    if (newLinks.length == 5) {
      setError(true);
    } else {
      createLink(singleNewLink).then((ok) => {
        if (ok) {
          getLinks().then((res) => {
            setNewLinks(res);
          });
        }
      });
    }
  }

  const handleCloseError = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setIsError(false);
  };

  const handleCloseSuccess = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setIsSaved(false);
  };

  if (newUserData != null && newLinks != null) {
    return (
      <>
        <form
          aria-label="Settings"
          id="settings"
          encType="multipart/form-data"
          method="POST"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="item">
            <label htmlFor="username">Username</label>
            <input
              name="username"
              id="username"
              onChange={(e) => setNewUserDataHelper(e)}
              value={newUserData["username"]}
              maxLength={150}
            ></input>
          </div>
          <div className="item">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              onChange={(e) => setNewUserDataHelper(e)}
              value={newUserData["email"]}
              maxLength={200}
            ></input>
          </div>
          <div className="item">
            <label htmlFor="first_name">First name</label>
            <input
              id="first_name"
              name="first_name"
              onChange={(e) => setNewUserDataHelper(e)}
              value={newUserData["first_name"]}
              maxLength={50}
            ></input>
          </div>
          <div className="item">
            <label htmlFor="last_name">Last name</label>
            <input
              id="last_name"
              name="last_name"
              onChange={(e) => setNewUserDataHelper(e)}
              value={newUserData["last_name"]}
              maxLength={50}
            ></input>
          </div>
          <div className="item">
            <label htmlFor="about_me">About me</label>
            <textarea
              id="about_me"
              name="about_me"
              onChange={(e) => setNewUserDataHelper(e)}
              value={newUserData["about_me"]}
              maxLength={250}
            ></textarea>
          </div>
          <div className="item">
            <label htmlFor="technical_info">Technical Info</label>
            <textarea
              id="technical_info"
              name="technical_info"
              onChange={(e) => setNewUserDataHelper(e)}
              value={newUserData["technical_info"]}
              maxLength={150}
            ></textarea>
          </div>
          <div className="item">
            <label htmlFor="profile_picture">
              Profile Picture (PNG or JPEG)
            </label>
            <input
              id="profile_picture"
              name="profile_picture"
              onChange={(e) => setProfilePictureHelper(e)}
              type="file"
              accept="image/png, image/jpeg"
            ></input>
          </div>
          <h2>Links</h2>
          {newLinks.map((content, index) => (
            <div className="item link-item" key={content["name"] + index}>
              <input
                defaultValue={content["name"]}
                name="name"
                onChange={(e) => setNewLinksHelper(e, index)}
              ></input>
              <p> - </p>
              <input
                name="link"
                defaultValue={content["link"]}
                onChange={(e) => setNewLinksHelper(e, index)}
              ></input>
              <button onClick={() => removeNewLinksHelper(index)}>
                <DeleteIcon />
              </button>
            </div>
          ))}
          <button id="save" type="button" onClick={handleOpen}>
            Add link
          </button>
          <Modal open={isModalOpen} onClose={handleClose}>
            <div id="modal">
              <label for="name">Name</label>
              <input
                id="name"
                name="name"
                defaultValue="Name"
                onChange={(e) => setSingleNewLinkHelper(e)}
              ></input>
              <label for="link">Link</label>
              <input
                id="link"
                name="link"
                defaultValue="Link"
                onChange={(e) => setSingleNewLinkHelper(e)}
              ></input>
              <button id="save" onClick={() => addNewLinksHelper()}>
                Save
              </button>
              <ErrorMessage message="Maximum of 5 links" isError={error} />
            </div>
          </Modal>
          <button
            id="save"
            onClick={() =>
              changeSettings(
                newUserData,
                setIsError,
                setIsSaved,
                newLinks,
                profilePicture,
              )
            }
            type="submit"
          >
            Save
          </button>
          <Snackbar
            open={isError}
            autoHideDuration={5000}
            onClose={handleCloseError}
          >
            <Alert onClose={handleCloseError} severity="error" variant="filled">
              Something went wrong!
            </Alert>
          </Snackbar>
          <Snackbar
            open={isSaved}
            autoHideDuration={5000}
            onClose={handleCloseSuccess}
          >
            <Alert
              onClose={handleCloseSuccess}
              severity="success"
              variant="filled"
            >
              Your changes were successfully saved!
            </Alert>
          </Snackbar>
        </form>
        <Outlet />
      </>
    );
  }
  return <p data-testid="loader">Loading</p>;
}

export default Settings;
