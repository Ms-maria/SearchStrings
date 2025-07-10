import React, { useState } from 'react';
import './ResultsTable.css';

const ResultsTable = ({ data }) => {
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
                    {data.map((item) => {
                        const matchCount = item.matches.length;
                        return (
                            <>
                                <tr key={item.id}>
                                    <td rowSpan={matchCount + 1}>{item.id}</td>
                                    <td rowSpan={matchCount + 1}>{item.text}</td>
                                </tr>
                                {item.matches.map((match, idx) => (
                                    <tr key={`${item.id}-${idx}`}>
                                        <td>{match.pattern}: {match.count}</td>
                                    </tr>
                                ))}
                            </>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default ResultsTable;