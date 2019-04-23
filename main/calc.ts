const getPrec = (char:string) => {
  if ("+-".indexOf(char) >= 0) {
    return 1;
  }
  if ("*/".indexOf(char) >= 0) {
    return 2;
  }
  if ("^".indexOf(char) >= 0) {
    return 3;
  }
  return 0;
};

const getAssoc = (char:string) => {
  if ("+-*/".indexOf(char) >= 0) {
    return "LEFT";
  }
  if ("^".indexOf(char) >= 0) {
    return "RIGHT";
  }
  return "LEFT";
};

const getBin = (op:string, a:number, b:number) => {
  if (op === "+") {
    return a + b;
  }
  if (op === "-") {
    return a - b;
  }
  if (op === "*") {
    return a * b;
  }
  if (op === "/") {
    return a / b;
  }
  if (op === "^") {
    return Math.pow(a, b);
  }
  return 0;
};

const isDigit = (char:string) => {
  return ("0123456789.".indexOf(char) >= 0);
};

const calc = (s:string) => {
  const numStk = [] as number[];
  const opStk = [] as string[];
  let i = 0;
  let isUnary = true;
  while (i < s.length) {
    while (i < s.length && s[i] === " ") {
      i += 1;
    }
    if (i >= s.length) {
      break;
    }
    if (isDigit(s[i])) {
      let numString = "";
      while (i < s.length && (isDigit(s[i]))) {
        numString += s[i];
        i += 1;
      }
      numStk.push(Number(numString));
      isUnary = false;
      continue;
    }
    if ("+-*/^".indexOf(s[i]) >= 0) {
      if (isUnary) {
        opStk.push("#");
      } else {
        while (opStk.length > 0) {
          if ((getAssoc(s[i]) === "LEFT" && getPrec(s[i])) <= getPrec(opStk[opStk.length - 1]) ||
            (getAssoc(s[i]) === "RIGHT" && getPrec(s[i])) < getPrec(opStk[opStk.length - 1])) {
            const op = opStk.pop()!;
            if (op === "#") {
              const val = numStk.pop()!;
              numStk.push(-val);
            } else {
              const b = numStk.pop()!;
              const a = numStk.pop()!;
              numStk.push(getBin(op, a, b));
            }
            continue;
          }
          break;
        }
        opStk.push(s[i]);
      }
      isUnary = true;
    } else if (s[i] === "(") {
      opStk.push(s[i]);
      isUnary = true;
    } else {
      while (opStk.length > 0) {
        const op = opStk.pop()!;
        if (op === "(") {
          break;
        }
        if (op === "#") {
          const val = numStk.pop()!;
          numStk.push(-val);
        } else {
          const b = numStk.pop()!;
          const a = numStk.pop()!;
          numStk.push(getBin(op, a, b));
        }
      }
    }
    i += 1;
  }
  while (opStk.length > 0) {
    const op = opStk.pop()!;
    if (op === "#") {
      const val = numStk.pop()!;
      numStk.push(-val);
    } else {
      const b = numStk.pop()!;
      const a = numStk.pop()!;
      numStk.push(getBin(op, a, b));
    }
  }
  return numStk.pop()!;
};

export { calc };
