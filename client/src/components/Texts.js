import React, { useState, useEffect } from "react";
import TextTile from "./TextTile";

const Texts = ({ handleChooseText, texts, completedTexts }) => {
  const [filteredTexts, setFilteredTexts] = useState(texts);
  const [filters, setFilters] = useState([]);

  const handleFilter = e => {
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

  useEffect(() => {
    let filteredTexts = [];
    if (filters.length === 0) {
      filteredTexts = [...texts];
    } else {
      if (texts && filters && filters.length > 0) {
        for (let i = 0; i < texts.length; i++) {
          for (let j = 0; j < filters.length; j++) {
            if (
              texts[i].tags.includes(filters[j].toLowerCase()) ||
              texts[i].level === filters[j]
            ) {
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

  const levels = ["Beginner", "Intermediate", "Advanced"];

  return (
    <div className="texts__wrapper">
      <div className="texts__filter">
        <div className="texts__level-filters">
          <span className="texts__filter-label">Filter by level:</span>
          <ul className="texts__level-list" onClick={handleFilter}>
            {levels.map((level, index) => (
              <li
                key={"level" + index}
                className={`texts__filter-item ${
                  filters.includes(level) ? "texts__filter-item--selected" : ""
                }`}
              >
                {level}
              </li>
            ))}
          </ul>
        </div>
        <div className="texts__topic-filters">
          <span className="texts__filter-label">Filter by topic:</span>
          <ul className="texts__topic-list" onClick={handleFilter}>
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
        </div>
      </div>
      <div className="texts__texts">
        {filteredTexts.map((text, index) => {
          return (
            <TextTile
              key={"tile" + index}
              title={text.title}
              level={text.level}
              handleChooseText={handleChooseText}
              isCompleted={completedTexts.includes(text.title)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Texts;
