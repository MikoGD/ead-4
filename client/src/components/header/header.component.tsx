import React from 'react';
import Navbar from './navbar.component';

export function Header(): React.ReactElement {
  return (
    <header className="text-center">
      <h1>EAD Lab 4</h1>
      <Navbar />
    </header>
  );
}

export default Header;
