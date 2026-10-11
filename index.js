const display = document.getElementById("display");

function appendToDisplay(input) {
  display.value += input;
}

function clearDisplay() {
  display.value = "";
  display.classList.add("animate__animated", "animate__fadeOutLeft");
  display.addEventListener(
    "animationend",
    () => {
      display.classList.remove("animate__animated", "animate__fadeOutLeft");
    },
    { once: true }
  );
}

function isValidNumber(str) {
  if (str === "") return false;
  if (str === "-" || str === "+") return false;
  const num = Number(str);
  return !isNaN(num) && isFinite(num);
}

function tokenize(expr) {
  const tokens = [];
  let i = 0;
  while (i < expr.length) {
    const c = expr[i];
    if (/\s/.test(c)) {
      i++;
      continue;
    }
    if (/\d/.test(c) || c === ".") {
      let j = i;
      if (c === ".") {
        j++;
      }
      while (j < expr.length && /\d/.test(expr[j])) j++;
      if (expr[j] === ".") {
        const after = j + 1;
        while (after < expr.length && /\d/.test(expr[after])) after++;
        tokens.push(expr.slice(i, after));
        i = after;
        continue;
      }
      tokens.push(expr.slice(i, j));
      i = j;
      continue;
    }
    if (c === "+" || c === "-" || c === "*" || c === "/") {
      tokens.push(c);
      i++;
      continue;
    }
    return null;
  }
  return tokens;
}

function toPostfix(tokens) {
  if (!tokens || tokens.length === 0) return null;
  const output = [];
  const ops = [];
  const precedence = { "+": 1, "-": 1, "*": 2, "/": 2 };
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (t === "+" || t === "-" || t === "*" || t === "/") {
      while (ops.length > 0) {
        const top = ops[ops.length - 1];
        if (precedence[top] >= precedence[t]) {
          output.push(ops.pop());
        } else {
          break;
        }
      }
      ops.push(t);
    } else {
      output.push(t);
    }
  }
  while (ops.length > 0) {
    output.push(ops.pop());
  }
  return output;
}

function evalPostfix(postfix) {
  const stack = [];
  for (let i = 0; i < postfix.length; i++) {
    const t = postfix[i];
    if (t === "+" || t === "-" || t === "*" || t === "/") {
      if (stack.length < 2) return null;
      const b = stack.pop();
      const a = stack.pop();
      let res;
      if (t === "+") res = a + b;
      else if (t === "-") res = a - b;
      else if (t === "*") res = a * b;
      else {
        if (Math.abs(b) < 1e-18 || b === 0) return null;
        res = a / b;
      }
      stack.push(res);
    } else {
      if (!isValidNumber(t)) return null;
      stack.push(Number(t));
    }
  }
  if (stack.length !== 1) return null;
  return stack[0];
}

function safeEval(expr) {
  if (expr === null || expr === undefined) return null;
  const trimmed = expr.trim();
  if (trimmed === "") return null;
  const tokens = tokenize(trimmed);
  if (!tokens) return null;
  const postfix = toPostfix(tokens);
  if (!postfix) return null;
  const val = evalPostfix(postfix);
  if (val === null || val === undefined || !isFinite(val)) return null;
  return val;
}

function calculate() {
  const result = safeEval(display.value);
  if (result === null) {
    display.value = "Error";
    return;
  }
  const rounded = Math.abs(result - Math.round(result)) < 1e-12 ? Math.round(result) : result;
  display.value = rounded.toString();
}

function handleKeydown(e) {
  const key = e.key;
  if (/^[0-9]$/.test(key)) {
    appendToDisplay(key);
    return;
  }
  if (key === ".") {
    appendToDisplay(".");
    return;
  }
  if (key === "+" || key === "-" || key === "*" || key === "/") {
    appendToDisplay(key);
    return;
  }
  if (key === "Enter" || key === "=") {
    e.preventDefault();
    calculate();
    return;
  }
  if (key === "Escape" || key === "c" || key === "C" || key === "Backspace" || key === "Delete") {
    clearDisplay();
    return;
  }
}

document.addEventListener("keydown", handleKeydown);