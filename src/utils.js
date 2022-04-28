function repeat(func) {
  var promise = Promise.resolve();
  while (func == false) promise = promise.then(func);
  return promise;
}

function waitTilTrue(func) {
  var promise = Promise.resolve();
  while (func != true) promise = promise.then(func);
  return promise;
}

export { repeat, waitTilTrue };
