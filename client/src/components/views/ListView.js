import React, { useState } from 'react';
import '../../css/ListView.scss';



const ListDisplay = ({ items }) => {
  return (
    <div>
      <div className="list-header">
        <div className="item-name">Name</div>
        <div className="item-kind">Kind</div>
        <div className="item-location">Location</div>
      </div>
      <ul className="list">
        {items.map(item => (
          <li key={item.id} className="list-item">
            <div className="item-details">
              <div className="item-name">{item.name}</div>
              <div className="item-kind">{item.kind}</div>
              <div className="item-location">{item.location}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

const ListFlip = ({ items }) => {
    const [currentPage, setCurrentPage] = useState(0);

    const itemsPerPage = 10; 
    const pageCount = Math.ceil(items.length / itemsPerPage);
  
    const handlePageClick = (newPage) => {
      setCurrentPage(newPage);
    };
  
    const displayItems = items.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);
  
    return (
      <div>
        <div className="list-header">
          <div className="item-name">Name</div>
          <div className="item-kind">Kind</div>
          <div className="item-location">Location</div>
        </div>
        <ul className="list">
          {displayItems.map(item => (
            <li key={item.id} className="list-item">
              <div className="item-details">
                <div className="item-name">{item.name}</div>
                <div className="item-kind">{item.kind}</div>
                <div className="item-location">{item.location}</div>
              </div>
            </li>
          ))}
        </ul>
        <div className="pagination">
          <button
            className={`pagination-button ${currentPage === 0 ? 'disabled' : ''}`}
            onClick={() => handlePageClick(currentPage - 1)}
            disabled={currentPage === 0}
          >
            Previous
          </button>
          <span className="pagination-info">
            Page {currentPage + 1} of {pageCount}
          </span>
          <button
            className={`pagination-button ${currentPage === pageCount - 1 ? 'disabled' : ''}`}
            onClick={() => handlePageClick(currentPage + 1)}
            disabled={currentPage === pageCount - 1}
          >
            Next
          </button>
        </div>
      </div>
    );
  };
  

export {ListDisplay,ListFlip}