import React from 'react';
import { Link } from 'react-router-dom';

function capitalizeWord(word: string) {
  const wordArr = word.split('');
  wordArr[0] = wordArr[0].toUpperCase();

  return wordArr.join('');
}

export function Navbar(): React.ReactElement {
  return (
    <nav className="navbar navbar-expand navbar-light bg-light">
      <ul className="navbar-nav mx-auto">
        {['display', 'add', 'update', 'remove', 'background'].map((link) => (
          <li className="nav-item" key={link}>
            <Link to={`/${link}`} className="nav-link">
              {capitalizeWord(link)}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
export default Navbar;
