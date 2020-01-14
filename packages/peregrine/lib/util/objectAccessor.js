function isNull(val) {
  return val === null;
}

function isUndefined(val) {
  return val === undefined;
}

function or(fn1, fn2) {
  return function(val) {
    return fn1(val) || fn2(val);
  };
}

function isNullOrUndefined(val) {
  return or(isNull, isUndefined)(val);
}

export function pathOr(backup, keyArray, obj) {
  const [key, ...rest] = keyArray;
  const result = obj[key];
  if (rest.length) {
    if (result instanceof Object) {
      return pathOr(backup, rest, result);
    } else {
      return backup;
    }
  } else {
    return isNullOrUndefined(result) ? backup : result;
  }
}

export function propOr(backup, key, obj) {
  return pathOr(backup, [key], obj);
}
