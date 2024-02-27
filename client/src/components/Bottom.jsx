import React, { useState, useEffect } from 'react';
import {observer} from "mobx-react-lite";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import '../css/main.css'

const NavBar = observer(() => {
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);
  const handleScroll = () => {
    const isBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight;
    setIsScrolledToBottom(isBottom);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <Navbar style={{background:'black', fontFamily:'Roboto Slab, serif'}} className={`navbar-bottom ${isScrolledToBottom ? 'show' : ''}`} fixed='bottom' >
      <Container>
        <Navbar.Brand style={{'fontSize':'30px','fontWeight' :'700', 'textTransform': 'uppercase', 'color': '#fff'}} href="#home">Album.by</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto" style={{ width: '100%' }}>
            <Nav.Link style={{'fonеSize':'14px', 'textTransform': 'uppercase', 'color': '#fff', width: '100%'}} href="#features" >Features</Nav.Link>
            <Nav.Link style={{'fontSize':'14px', 'textTransform': 'uppercase', 'color': '#fff', width: '100%'}} href="#pricing">Pricing</Nav.Link>
          </Nav>
        </Navbar.Collapse>
        
        <div style={{ 'fontSize': '14px', 'textTransform': 'uppercase', 'color': '#fff', padding: '20px' }}>
          contacts:
          <ul>
            <li style={{ 'fontSize': '14px', 'textTransform': 'uppercase', 'color': '#fff', width: '100%', marginTop: '10px' }} href="tel:+375297954512">+375(29)7954512</li>
            <li style={{ 'fontSize': '14px', 'textTransform': 'uppercase', 'color': '#fff', width: '100%' }} href="tel:+375297954512">+375(29)7954512</li>
          </ul>
        </div>
     
      </Container> 
      
    </Navbar>
 );
  })

export default NavBar;