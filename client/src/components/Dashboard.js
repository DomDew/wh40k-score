import React from "react";
import useLocalStorage from "../utils/useLocalStorage";

// COMPONENTS
import Navbar from "./Navbar";
import SectionFolder from "./SectionFolder";
import MatchPreview from "./MatchPreview";

export default function Dashboard(props) {
  const { clearItem } = useLocalStorage("access-token");

  const logout = () => {
    clearItem();
    props.history.push("/");
  };

  return (
    <div className="app-container">
      <Navbar logout={logout} />
      <SectionFolder title="Match History">
        <MatchPreview />
        <MatchPreview />
      </SectionFolder>
    </div>
  );
}
