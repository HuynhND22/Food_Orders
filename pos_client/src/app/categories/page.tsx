// components/SubLayout.js
import React from "react";
import Master from "../../components/layouts/master";

const SubLayout = () => {
  return (
    <Master>
      <aside>
        <h2>Sidebar</h2>
        <ul>
          <li>
            <a href="/link1">Link 1</a>
          </li>
          <li>
            <a href="/link2">Link 2</a>
          </li>
        </ul>
      </aside>
      <section>{}</section>
    </Master>
  );
};

export default SubLayout;
