// Return boolean indicating if input is an integer
function is_int(n){
  return Number(n) === n && n % 1 === 0;
}

// Return boolean indicating if input is a float
function is_float(n){
  return Number(n) === n && n % 1 !== 0;
}

