import React, { useState, useEffect } from "react";
import TextTile from "./TextTile";

const Texts = ({ handleChooseText, texts, completedTexts }) => {
  const [filteredTexts, setFilteredTexts] = useState(texts);
  const [levelFilters, setLevelFilters] = useState([]);
  const [topicFilters, setTopicFilters] = useState([]);

  const handleLevelFilter = e => {
    //make sure user has clicked on LI button rather than parent UL element
    if (e.target.tagName !== "LI") {
      return
    }
    const selectedFilter = e.target.innerText;
    if (levelFilters.includes(selectedFilter)) {
      const updatedLevelFilters = levelFilters.filter(
        filter => filter !== selectedFilter
      );
      setLevelFilters([...updatedLevelFilters]);
      return;
    }
    setLevelFilters([...levelFilters, selectedFilter]);
  };

  const handleTopicFilter = e => {
    const selectedFilter = e.target.innerText;
    if (topicFilters.includes(selectedFilter)) {
      const updatetedTopicFilters = topicFilters.filter(
        filter => filter !== selectedFilter
      );
      setTopicFilters([...updatetedTopicFilters]);
      return;
    }
    setTopicFilters([...topicFilters, selectedFilter]);
  };

  useEffect(() => {
    //start with all texts
    let filteredTexts = [...texts];
    //filter for level if level filter applied
    if (levelFilters.length > 0) {
      let filteredByLevel = []
      for (let i = 0; i < texts.length; i++) {
        for (let j = 0; j < levelFilters.length; j++) {
          if (
            texts[i].level === levelFilters[j]
          ) {
            filteredByLevel.push(texts[i]);
          }
        }
      }
      filteredTexts = [...filteredByLevel]
    }
    //filter for topic if topic filter applied
    if (topicFilters.length > 0) {
      let filteredByTopic = []
      for (let i = 0; i < filteredTexts.length; i++) {
        for (let j = 0; j < topicFilters.length; j++) {
          if (
            filteredTexts[i].tags.includes(topicFilters[j].toLowerCase())
          ) {
            filteredByTopic.push(filteredTexts[i])
          }
        }
      }
      filteredTexts = [...filteredByTopic]
    }
    setFilteredTexts(filteredTexts);
    //eslint-disable-next-line
  }, [levelFilters, topicFilters]);




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
          <ul className="texts__level-list" onClick={handleLevelFilter}>
            {levels.map((level, index) => (
              <li
                key={"level" + index}
                className={`texts__filter-item ${
                  levelFilters.includes(level) ? "texts__filter-item--selected" : ""
                  }`}
              >
                {level}
              </li>
            ))}
          </ul>
        </div>
        <div className="texts__topic-filters">
          <span className="texts__filter-label">Filter by topic:</span>
          <ul className="texts__topic-list" onClick={handleTopicFilter}>
            {topics.map((topic, index) => (
              <li
                key={"topic" + index}
                className={`texts__filter-item ${
                  topicFilters.includes(topic) ? "texts__filter-item--selected" : ""
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
