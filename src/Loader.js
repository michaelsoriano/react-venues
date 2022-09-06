import React from "react";

function Loader(props) {
  props.loading ? (
    <div className="Loading">
      <span>{props.text}</span>
    </div>
  ) : (
    ""
  );
}

export default Loader;
