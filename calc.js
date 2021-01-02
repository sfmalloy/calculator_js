class EvalError extends Error {
  constructor(message) {
    super(message);
    this.name = "EvalError";
  }
}

function calculate(left, op, right) {
  if (op == Symbols.PLUS)
    return left + right;
  else if (op == Symbols.MINUS)
    return left - right;
  else if (op == Symbols.TIMES)
    return left * right;
  else if (op == Symbols.DIVIDES)
    return left / right;
  else if (op == Symbols.POWER)
    return Math.pow(left, right);
}

function evaluate(node) {
  try {
    if (node instanceof ExpressionNode) {
      let lhs = evaluate(node.left);
      let rhs = evaluate(node.right);
      return calculate(lhs, node.op, rhs);
    } else {
      return node.value;
    }
  } catch (error) {
    throw new EvalError("Error while evaluating, cannot get value of unknown symbol");
  }

}

document.addEventListener("keydown", ({key}) => {
  let output = document.getElementById("output");
  if (key === "Enter") {
    try {
      let lexer = new Lexer(document.getElementById("expression").value);
      let parser = new Parser(lexer);
      let tree = parser.parse();
      output.innerHTML = evaluate(tree);
    } catch (error) {
      output.innerHTML = error.name + ': ' + error.message;
    }
  }
});

window.onload = () => {
  Array.from(document.getElementsByClassName("number_row")).forEach((row) => {
    Array.from(row.getElementsByTagName("button")).forEach((button) => {
      button.addEventListener("click", () => {
        if (button.innerText !== "=" && button.innerText !== "C")
          document.getElementById("expression").value += button.innerText;
        else if (button.innerText === "=")
          document.dispatchEvent(new KeyboardEvent("keydown", {"key": "Enter"}));
        else
          document.getElementById("expression").value = "";
      });

      button.addEventListener("mouseup", () => { button.blur(); });
    });
  });
};
