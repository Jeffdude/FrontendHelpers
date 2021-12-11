import React from 'react';

import { Navbar, Nav } from 'react-bootstrap';
import { HiUserCircle } from 'react-icons/hi';
import { HiCog } from 'react-icons/hi';
import { useSelector } from 'react-redux';

import logo from '../assets/JMKRIDE_RWU_BlackBG.svg';
import { InventorySelector } from './selectors.js';
import { selectAuthState } from '../redux/authSlice.js';


export default function Header() {
  const authState = useSelector(selectAuthState);
  return (
    <Navbar className="header" variant="dark" expand="xl" sticky="top">
      <Navbar.Brand href="/">
        <img
          src={logo}
          className="header-logo d-inline-block align-top"
          alt="JMKRIDE logo"
         />
      </Navbar.Brand>
      <Navbar.Toggle className="header-toggle"/>
      <Navbar.Collapse className="header-dropdown"> 
        <div className="header-item-list">
          <Nav.Link href="/">Categories</Nav.Link>
          <Nav.Link href="/completeset">Complete Sets</Nav.Link>
          <Nav.Link href="/withdraw-custom-completeset">Custom Set</Nav.Link>
          <Nav.Link href="/part">Parts</Nav.Link>
          <Nav.Link href="/logs">Logs</Nav.Link>
        </div>
        <div className="header-item-list">
          <div className="header-text">
            Inventory:
            { authState ? <InventorySelector dark={true}/> : " Not Available." }
          </div>
          <div className="flex-row">
            <Nav.Link className="ml-auto" href="/settings">
              <HiCog size={30} color="white"/>
            </Nav.Link>
            <Nav.Link className="ml-auto" href="/profile">
              <HiUserCircle className="account-icon" size={40}/>
            </Nav.Link>
          </div>
        </div>
      </Navbar.Collapse>
    </Navbar>
  )
}
