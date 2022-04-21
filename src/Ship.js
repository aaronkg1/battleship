const ShipFactory = (length, name) => {
  const segments = [];
  let sunk = false;
  const setSegments = (() => {
    for (let i = 0; i < length; i++) {
      segments.push({
        segment: i,
        hit: false,
      });
    }
  })();
  const hit = (index) => {
    segments[index].hit = true;
  };
  const isSunk = () => {
    let hitCounter = 0;
    for (const segment of segments) {
      if (segment.hit == true) {
        hitCounter++;
      }
    }
    if (hitCounter == length) {
      sunk = true;
    }
    return sunk;
  };

  return { length, segments, name, hit, isSunk };
};

export default ShipFactory;
