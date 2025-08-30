import React, { useEffect, useState } from "react";
import "./style.css";
import { Alert, Button, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { getDatabase, onValue, push, ref, set } from "firebase/database";
import { useSelector } from "react-redux";

const Grouplist = () => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const db = getDatabase();
  const user = useSelector((users) => users.loginSlice.login);
  const [groupName, setGroupName] = useState("");
  const [groupTag, setGroupTag] = useState("");
  const [randomGrp, setRandomGrp] = useState([]);
 
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  // create group
  const handleCreate = () => {
    set(push(ref(db, "groups")), {
      groupname: groupName,
      grouptag: groupTag,
      admin: user.displayName,
      adminid: user.uid,
    }).then(() => {
      setOpen(false);
    });
  };

  // Render group data
  useEffect(() => {
    const starCountRef = ref(db, "groups");
    onValue(starCountRef, (snapshot) => {
      let groupArr = [];
      snapshot.forEach((item) => {
        if (user.uid !== item.val().adminid) {
          groupArr.push({ ...item.val(), id: item.key });
        }
      });
      setRandomGrp(groupArr);
    });
  }, []);

  // Join group
  const handleJoinGrp = (item) => {
    set(push(ref(db, "groupjoinrequest")), {
      groupid: item.id,
      groupname: item.groupname,
      grouptag: item.grouptag,
      adminid: item.adminid,
      adminname: item.admin,
      userid: user.uid,
      username: user.displayName,
    });
  };

  return (
    <div className="grouplist">
      <div className="grouplist-header">
        <h4>Group List</h4>
        <div className="group-creation">
          <Button
            className="grp-create-btn"
            variant="text"
            onClick={handleOpen}
          >
            create group
          </Button>
        </div>
      </div>
      {randomGrp.length === 0 ? (
        <Alert severity="error">No groups created yet</Alert>
      ) : (
        randomGrp.map((item, i) => (
          <div className="group-item-wrapper" key={i}>
            <div className="group-images">
              <picture>
                <img src="./media/images/grouplist1.png" alt="pro_pic" />
              </picture>
            </div>
            <div className="groups-name">
              <span>Admin: {item.admin}</span>
              <h4>{item.groupname}</h4>
              <span>{item.grouptag}</span>
            </div>
            <div className="group-list-btn">
              <button type="button" onClick={() => handleJoinGrp(item)}>
                Join
              </button>
            </div>
          </div>
        ))
      )}

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Create Group
          </Typography>
          <TextField
            id="outlined-basic"
            label="Group Name"
            variant="outlined"
            fullWidth
            margin="normal"
            onChange={(e) => setGroupName(e.target.value)}
          />
          <TextField
            id="outlined-basic"
            label="Group Name"
            variant="outlined"
            fullWidth
            margin="normal"
            onChange={(e) => setGroupTag(e.target.value)}
          />
          <Button
            variant="contained"
            className="create-button"
            onClick={handleCreate}
          >
            Create Your Group
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default Grouplist;
