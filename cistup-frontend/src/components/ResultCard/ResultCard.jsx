import "./ResultCard.css";

import React from "react";
import PropTypes from "prop-types";

const ResultCard = ({ objects }) => {
  return Object.entries(objects).map(([object, count], index) => (
    <objects-detected key={index}>
      <object-name>{object}</object-name>
      <object-count>{count}</object-count>
    </objects-detected>
  ));
};

ResultCard.propTypes = {
  objects: PropTypes.object.isRequired,
};

export default ResultCard;
