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
  if (node instanceof ExpressionNode) {
    let lhs = evaluate(node.left);
    let rhs = evaluate(node.right);
    return calculate(lhs, node.op, rhs);
  } else {
    return node.value;
  }
}

document.addEventListener('keyup', (key) => {
  if (key.code == 'Enter') {
    let lexer = new Lexer(document.getElementById('expression').value);
    let parser = new Parser(lexer);
    let tree = parser.parse();

    document.getElementById('output').innerHTML = evaluate(tree);
  }
});
