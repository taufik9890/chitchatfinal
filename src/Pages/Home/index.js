import { Grid } from "@mui/material";
import React from "react";
import Blocklist from "../../Component/Block";
import Friendrequest from "../../Component/Friendrequest";
import Friends from "../../Component/Friends";
import Grouplist from "../../Component/Grouplist";
import Mygroups from "../../Component/Mygroups";
import Searchbox from "../../Component/Searchbox";
import Userlist from "../../Component/Userlists";
import "./style.css";

const Home = () => {
  return (
    <>
      <Grid container className="home-pages">
        <Grid item xs={4} className="home-items">
          <div>
            <Searchbox />
          </div>
          <div>
            <Grouplist />
            <Friendrequest />
          </div>
        </Grid>
        <Grid item xs={4} className="home-items">
          <div>
            <Friends />
          </div>
          <div>
            <Mygroups />
          </div>
        </Grid>
        <Grid item xs={4} className="home-items">
          <div>
            <Userlist />
          </div>
          <div>
            <Blocklist />
          </div>
        </Grid>
      </Grid>
    </>
  );
};

export default Home;
