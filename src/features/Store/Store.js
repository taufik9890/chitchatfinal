import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../Slice/UserSlice";
import activeChatSlice from "../Slice/activeChatSlice";
import modeSlice from "../Slice/themeSlice";

const store = configureStore({
  reducer: {
    loginSlice: authSlice,
    activeChat: activeChatSlice,
    themeChange: modeSlice,
  },
});

export default store;
