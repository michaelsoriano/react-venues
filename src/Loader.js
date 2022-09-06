import React from "react";

function Loader({ loading }) {
  loading ? (
    <div className="Loading">
      <span>{props.text}</span>
    </div>
  ) : (
    ""
  );
}

export default Loader;
