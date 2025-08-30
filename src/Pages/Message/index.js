import React from "react";
import "./style.css";
import { Grid } from "@mui/material";
import MsgGroup from "../../Component/MsgGroup";
import Searchbox from "../../Component/Searchbox/index";
import MsgFriend from "../../Component/MsgFriend";
import Chatting from "../../Component/Chatting";

const Message = () => {
  return (
    <>
      <div className="msggrp-page">
        <Grid container justifyContent="space-between">
          <Grid item xs={4} className="grp-items">
            <div>
              <Searchbox />
            </div>
            <div>
              <MsgGroup />
              <MsgFriend />
            </div>
          </Grid>
          <Grid item xs={7.5}>
            <div>
              <Chatting />
            </div>
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default Message;
