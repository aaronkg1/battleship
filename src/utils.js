function repeat(func) {
  var promise = Promise.resolve();
  while (func == false) promise = promise.then(func);
  return promise;
}

export { repeat };
