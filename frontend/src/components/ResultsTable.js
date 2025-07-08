import React, { useState } from 'react';
import './ResultsTable.css';

const ResultsTable = ({ data }) => {
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="table-container">
      <table className="results-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Строка</th>
            <th>Совпадения</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <React.Fragment key={item.id}>
              <tr>
                <td>{item.id}</td>
                <td className="text-cell">
                  {expandedId === item.id 
                    ? item.text 
                    : `${item.text.substring(0, 50)}${item.text.length > 50 ? '...' : ''}`}
                  {item.text.length > 50 && (
                    <button 
                      onClick={() => toggleExpand(item.id)}
                      className="expand-btn"
                    >
                      {expandedId === item.id ? '▲ Свернуть' : '▼ Развернуть'}
                    </button>
                  )}
                </td>
                <td>
                  {Array.isArray(item.matches) 
                    ? item.matches.join(', ') 
                    : item.matches}
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResultsTable;