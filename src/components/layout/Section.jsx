import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import './Section.css';

const Section = ({ title, children, linkTo = null }) => {
  return (
    <section className="section">
      <div className="sectionHeader">
        <h2 className="sectionTitle">{title}</h2>
        {linkTo && (
          <Link to={linkTo} className="sectionLink">
            Lihat Semua <ChevronRight size={16} />
          </Link>
        )}
      </div>
      <div className="grid">
        {children}
      </div>
    </section>
  );
};

export default Section;
