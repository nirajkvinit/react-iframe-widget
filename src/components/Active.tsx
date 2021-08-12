import React, { useState, useEffect } from "react";

const Active: React.FC<Props> = (props) => {
  const [active, setActive] = useState([]);

  return (
    <div className="h-100 w-100">
      <div className="p-3">
        <h4>My Active Tasks</h4>
        <p className="m-0 text-muted">
          Welcome back . Here is the list of your remaining active tasks.
        </p>
      </div>
      <div className="h-100 overflow-auto">
        <ul className="list-group">Some list group</ul>
      </div>
    </div>
  );
};

export default Active;
