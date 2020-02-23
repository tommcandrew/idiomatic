import React, { useState, useEffect } from "react";
import TextTile from "./TextTile";

const ChooseText = ({ handleChooseText, texts }) => {
  const [filteredTexts, setFilteredTexts] = useState(texts);
  const [filters, setFilters] = useState([]);

  const handleClick = e => {
    const selectedFilter = e.target.innerText;
    setFilters([...filters, selectedFilter]);
  };

  const clearFilters = () => {
    const emptyArray = [];
    setFilters(emptyArray);
  };

  useEffect(() => {
    let filteredTexts = [];
    if (filters.length === 0) {
      filteredTexts = [...texts];
    } else {
      if (texts && filters && filters.length > 0) {
        for (let i = 0; i < texts.length; i++) {
          for (let j = 0; j < filters.length; j++) {
            if (texts[i].tags.includes(filters[j].toLowerCase())) {
              filteredTexts.push(texts[i]);
            }
          }
        }
      }
    }
    setFilteredTexts(filteredTexts);
    //eslint-disable-next-line
  }, [filters]);

  return (
    <div className="chooseText__wrapper">
      <div className="chooseText__filter">
        <span>Filter texts by topic:</span>
        <ul className="chooseText__topic-list" onClick={handleClick}>
          <li>Animals</li>
          <li>Cities</li>
          <li>Nature</li>
          <li>Food</li>
          <li>Environment</li>
          <li>Geography</li>
          <li>History</li>
          <li>Science</li>
          <li>Culture</li>
          <li>Festivals</li>
        </ul>
        <span onClick={clearFilters}>Clear filters</span>
      </div>

      <div className="chooseText__texts">
        {filteredTexts.map((text, index) => (
          <TextTile
            key={"tile" + index}
            title={text.title}
            handleChooseText={handleChooseText}
          />
        ))}
      </div>
    </div>
  );
};

export default ChooseText;
