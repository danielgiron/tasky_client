//import { BrowserRouter, Route, Routes, Link, useParams } from 'react-router-dom';
import React, { useState, useEffect } from "react";
// import './PageNotFound.css'

function PageInfo(props) {
  return (
    <div className="PageInfo">
      <div className="Img AlertImg" alt="Alert" />
      <div className="Body">
        <div className="Header">Error 404: Page Not Found</div>
        <div className="Text">The page you are looking for does not exist.</div>
      </div>
    </div>
  );
}
export default PageInfo;
