import React, { useState } from "react";
import Dashboard from "./Dashboard";
import ChooseText from "./ChooseText";
import UploadText from "./UploadText";
import Header from "./Header";
import StartPage from "./StartPage";
import Reader from "./Reader";

const texts = [
  {
    title: "Greenland",
    tags: ["geography"],
    targetWords: [
      "sets",
      "coast",
      "beard",
      "persuade",
      "decided",
      "planted",
      "mystery"
    ],
    text:
      "Greenland is a huge island in the far, far north of the world. The weather there is very harsh and cold. Even the hottest summer day in Greenland is like a cool winter's day in England. In the summer months, the sun never sets; it is light all through the night. The warmest part of the island is on the south coast and that is where most Greenlanders live. However, it is still a very hard place to live because of the cold. Over the years, different groups of people have tried to live in Greenland, but most found it too difficult. One man who did live there, and one of the most famous Greenlanders, was 'Erik the Red'. Erik's name might have come from the colour of his hair and beard, or possibly because of his fiery temper. About 1000 years ago, Erik was sent away from his home in Iceland. He sailed away from this small ice-covered island to a great big ice-covered island. This island had no name yet and no one lived there, so Erik made it his home. The old stories of Iceland say that Erik became bored and lonely and wanted to persuade other people to come and live on this freezing-cold island with him. Erik had an idea. He called the island ”Greenland” and pretended that it was lovely, warm and ... green. His trick worked. When the people from Iceland heard about this perfect place called ”Greenland”, many of them decided to join Erik. About 300 of them packed up their belongings and set off to join him. Although life was hard, these people lived on Greenland for many years and it became their home. They built houses that were snug and strong from stone, wood and turf. They planted crops and kept cows, goats and sheep that they had brought with them all the way from Iceland. However, 500 years later, there was nothing left of Erik and his friends in Greenland. What happened to them is still a mystery."
  },
  { title: "Plastic and the environment", tags: ["environment"] },
  { title: "Bats in your garden", tags: ["animals"] },
  { title: "Guide dogs", tags: ["animals"] },
  { title: "Clouds", tags: ["nature", "science"] },
  { title: "All about potatoes", tags: ["food", "science"] },
  { title: "Diwali", tags: ["culture", "festivals"] },
  { title: "London", tags: ["cities"] },
  { title: "Halloween", tags: ["festivals", "culture"] },
  { title: "My City", tags: ["cities"] }
];

const Main = () => {
  const [showDashboard, setShowDashboard] = useState(true);
  const [showChooseText, setShowChooseText] = useState(false);
  const [showUploadText, setShowUploadText] = useState(false);
  const [showStartPage, setShowStartPage] = useState(false);
  const [selectedText, setSelectedText] = useState(null);
  const [showReader, setShowReader] = useState(false);
  const handleShowChooseText = () => {
    setShowDashboard(false);
    setShowChooseText(true);
  };

  const handleShowUploadText = () => {
    setShowDashboard(false);
    setShowUploadText(true);
  };

  const handleShowDashboard = () => {
    setShowChooseText(false);
    setShowUploadText(false);
    setShowStartPage(false);
    setShowReader(false);
    setShowDashboard(true);
  };

  const handleChooseText = title => {
    const selectedText = texts.filter(text => text.title === title)[0];
    setSelectedText(selectedText);
    setShowChooseText(false);
    setShowStartPage(true);
  };

  const handleShowReader = () => {
    setShowStartPage(false);
    setShowReader(true);
  };

  return (
    <>
      <Header handleShowDashboard={handleShowDashboard} />

      {showDashboard && (
        <Dashboard
          handleShowChooseText={handleShowChooseText}
          handleShowUploadText={handleShowUploadText}
        />
      )}
      {showChooseText && (
        <ChooseText
          setSelectedText={setSelectedText}
          texts={texts}
          handleChooseText={handleChooseText}
        />
      )}
      {showUploadText && (
        <UploadText handleShowDashboard={handleShowDashboard} />
      )}
      {showStartPage && (
        <StartPage
          selectedText={selectedText}
          handleShowReader={handleShowReader}
        />
      )}
      {showReader && <Reader text={selectedText} />}
    </>
  );
};

export default Main;
