const Player = (name) => {
  let gameboard;
  let score = 0;
  let active;
  const setActive = () => {
    active = true;
  };
  const setInactive = () => {
    active = false;
  };

  return { name, score, gameboard, setActive, setInactive };
};

export default Player;
