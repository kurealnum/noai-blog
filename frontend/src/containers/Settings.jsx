import { useEffect, useState } from "react";
import { Outlet, useNavigate, useRouteLoaderData } from "react-router-dom";
import { Alert, CircularProgress, Snackbar } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Modal from "@mui/material/Modal";
import ErrorMessage from "../components/ErrorMessage";
import {
  getLinks,
  deleteLink,
  createLink,
  changeSettings,
  deleteAccount,
} from "../features/helpers";
import { Close, LockOpen } from "@mui/icons-material";
import ConfirmationModal from "../components/ConfirmationModal";

function Settings() {
  const userData = useRouteLoaderData("root");

  const [newUserData, setNewUserData] = useState(userData);
  const [newLinks, setNewLinks] = useState([]);
  const [singleNewLink, setSingleNewLink] = useState({});
  const [isSaved, setIsSaved] = useState(false);
  const [profilePicture, setProfilePicture] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteProfileModalOpen, setIsDeleteProfileModalOpen] =
    useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const navigate = useNavigate();

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
    deleteLink(newLinks[index]).then((res) => {
      if (res.ok) setIsSaved(true);
    });
  }

  function addNewLinksHelper() {
    if (newLinks.length == 5) {
      setError(true);
    } else {
      createLink(singleNewLink).then((ok) => {
        if (ok) {
          getLinks().then((res) => {
            setNewLinks(res);
            setIsSaved(true);
            setIsModalOpen(false);
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

  function formSubmitHelper(e) {
    e.preventDefault();
    changeSettings(
      newUserData,
      setIsError,
      setIsSaved,
      newLinks,
      profilePicture,
    ).then((res) => {
      if (res) {
        setIsSaved(true);
      } else {
        setIsError(true);
      }
    });
  }

  function deleteAccountHelper() {
    deleteAccount(true).then((res) => {
      if (res) {
        navigate("/login");
      }
    });
  }

  function toggleIsDeleteProfileModalOpen() {
    setIsDeleteProfileModalOpen(!isDeleteProfileModalOpen);
  }

  if (newUserData != null && newLinks != null) {
    return (
      <div className="filler-wrapper">
        <h1>Settings</h1>
        <form
          className="custom-form"
          aria-label="Settings"
          id="settings"
          encType="multipart/form-data"
          method="POST"
          onSubmit={(e) => formSubmitHelper(e)}
        >
          <fieldset>
            <legend>User information</legend>
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
            <button className="form-button">
              <a href={"/manage-password/change-password/"}>Change password</a>
            </button>
          </fieldset>
          <fieldset className="orange-border">
            <legend>Danger zone</legend>
            <div className="spacing-wrapper delete-wrapper">
              {isDisabled ? (
                <button disabled type="button">
                  Delete Account
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsDeleteProfileModalOpen(true)}
                >
                  Delete Account
                </button>
              )}
              <button onClick={() => setIsDisabled(!isDisabled)} type="button">
                <LockOpen />
              </button>
              {isDeleteProfileModalOpen ? (
                <ConfirmationModal
                  helperFunction={deleteAccountHelper}
                  message={
                    "Are you sure you want to delete your profile? This will delete it forever (a really long time)!"
                  }
                  isOpen={isDeleteProfileModalOpen}
                  toggleOpen={toggleIsDeleteProfileModalOpen}
                />
              ) : null}
            </div>
          </fieldset>
          <fieldset>
            <legend>Personalization</legend>
            <div className="item">
              <label htmlFor="first_name">First name (optional)</label>
              <input
                id="first_name"
                name="first_name"
                onChange={(e) => setNewUserDataHelper(e)}
                value={newUserData["first_name"]}
                maxLength={50}
              ></input>
            </div>
            <div className="item">
              <label htmlFor="last_name">Last name (optional)</label>
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
          </fieldset>
          <fieldset>
            <legend>Links</legend>

            <i>
              <p>All links must be HTTPS. Maximum of 5 links.</p>
            </i>
            <ul className="links-list">
              {newLinks.map((content, index) => (
                <li className="item link-item" key={content["name"] + index}>
                  <label htmlFor="name" hidden>
                    Name
                  </label>
                  <input
                    id="name"
                    defaultValue={content["name"]}
                    name="name"
                    onChange={(e) => setNewLinksHelper(e, index)}
                  ></input>
                  <p> - </p>
                  <label htmlFor="link" hidden>
                    Link
                  </label>
                  <input
                    id="link"
                    name="link"
                    defaultValue={content["link"]}
                    onChange={(e) => setNewLinksHelper(e, index)}
                  ></input>
                  <button
                    type="button"
                    onClick={() => removeNewLinksHelper(index)}
                    data-testid="delete-button"
                  >
                    <DeleteIcon />
                  </button>
                </li>
              ))}
            </ul>
            <div className="margin-wrapper">
              <button
                type="button"
                onClick={handleOpen}
                data-testid="modal-open"
                className="special-button"
              >
                Add link
              </button>
            </div>
          </fieldset>
          <Modal open={isModalOpen} onClose={handleClose}>
            <div className="modal custom-form">
              <button className="icon-button" onClick={handleClose}>
                <Close />
              </button>
              <div className="item">
                <label htmlFor="name">New Name</label>
                <input
                  id="name"
                  name="name"
                  defaultValue="Name"
                  onChange={(e) => setSingleNewLinkHelper(e)}
                ></input>
              </div>
              <div className="item">
                <label htmlFor="link">Link</label>
                <input
                  id="link"
                  name="link"
                  defaultValue="Link"
                  onChange={(e) => setSingleNewLinkHelper(e)}
                ></input>
              </div>
              <button
                id="save"
                onClick={() => addNewLinksHelper()}
                data-testid="link-save"
                type="submit"
              >
                Save
              </button>
              <ErrorMessage message="Maximum of 5 links" isError={error} />
            </div>
          </Modal>
          <button data-testid="form-save" id="save" type="submit">
            Save
          </button>
        </form>
        <Snackbar
          open={isError}
          autoHideDuration={5000}
          onClose={handleCloseError}
        >
          <Alert
            onClose={handleCloseError}
            severity="error"
            variant="filled"
            className="error-mui-alert"
          >
            Something went wrong!
          </Alert>
        </Snackbar>
        <Snackbar
          open={isSaved}
          autoHideDuration={5000}
          onClose={handleCloseSuccess}
        >
          <Alert
            className="general-mui-alert"
            data-testid="saved-alert"
            onClose={handleCloseSuccess}
            severity="success"
            variant="filled"
          >
            Your changes were successfully saved!
          </Alert>
        </Snackbar>
        <Outlet />
        <div className="filler"></div>
      </div>
    );
  }
  // this doesn't make sense to use tanstack here
  // id is for styling purposes
  return (
    <div id="settings">
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
      ;
    </div>
  );
}

export default Settings;
