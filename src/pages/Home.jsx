import React from 'react';
import { Link, animateScroll as scroll } from 'react-scroll';
import NavBar from '../components/NavBar';
import Latest from '../components/Latest';
import SearchArea from '../components/SearchArea';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div>
      <NavBar />
      <br />
      <br />
      <br />
      <button
        onClick={() => scroll.scrollToBottom({ smooth: true, duration: 1000 })}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          padding: '10px 15px',
          background: 'blue',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Scroll to Bottom
      </button>

      <SearchArea />
      <Latest />

      <Link to="footer" smooth={true} duration={1000}>
        <button style={{ display: 'block', margin: '20px auto', padding: '10px' }}>
          Go to Footer
        </button>
      </Link>

      <div id="footer">
        <Footer />
      </div>
    </div>
  );
}
