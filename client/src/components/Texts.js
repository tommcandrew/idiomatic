import React, { useState, useEffect } from "react";
import TextTile from "./TextTile";

const Texts = ({ handleChooseText, texts }) => {
  const [filteredTexts, setFilteredTexts] = useState(texts);
  const [filters, setFilters] = useState([]);

  const handleClick = e => {
    const selectedFilter = e.target.innerText;
    if (filters.includes(selectedFilter)) {
      const updatetedFilters = filters.filter(
        filter => filter !== selectedFilter
      );
      setFilters([...updatetedFilters]);
      return;
    }
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

  const topics = [
    "Animals",
    "Cities",
    "Nature",
    "Food",
    "Environment",
    "Science",
    "Festivals"
  ];

  return (
    <div className="texts__wrapper">
      <div className="texts__filter">
        <span className="texts__filter-label">Filter by topic:</span>
        <ul className="texts__topic-list" onClick={handleClick}>
          {topics.map((topic, index) => (
            <li
              key={"topic" + index}
              className={`texts__filter-item ${
                filters.includes(topic) ? "texts__filter-item--selected" : ""
              }`}
            >
              {topic}
            </li>
          ))}
        </ul>
        <span onClick={clearFilters} className="texts__clear-filters">
          Clear filters
        </span>
      </div>

      <div className="texts__texts">
        {filteredTexts.map((text, index) => (
          <TextTile
            key={"tile" + index}
            title={text.title}
            level={text.level}
            handleChooseText={handleChooseText}
          />
        ))}
      </div>
    </div>
  );
};

export default Texts;
