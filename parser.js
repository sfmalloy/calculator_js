class ExpressionNode {
  // left -> Node
  // op -> symbol
  // right -> Node
  constructor(left, op, right) {
    this.left = left;
    this.op = op;
    this.right = right;
  }
}

class NumberNode {
  // value -> float
  constructor(value) {
    this.value = value;
  }
}

class Parser {
  constructor(lexer) {
    this.lexer = lexer;
  }

  parse() {
    return this.expr();
  }

  expr(prevPrecedence=-1) {
    let lhs = this.term();
    while (this.lexer.hasLexemes()) {
      let op = this.lexer.nextLexeme();
      console.log('op', names[op.symbol]);
      if (op != null && op.isOperator()) {
        let currPrecedence = op.precedence();
        
        if (currPrecedence < prevPrecedence) {
          this.lexer.decrement();
          break;
        }

        let rhs;
        if (op.association() == LTR_ASSOC)
          rhs = this.expr(currPrecedence + 1);
        else
          rhs = this.expr(currPrecedence);
        lhs = new ExpressionNode(lhs, op.symbol, rhs);
      } else {
        this.lexer.decrement();
        break;
      }
    }
    return lhs;
  }

  term() {
    let val = this.lexer.nextLexeme();
    console.log('val', names[val.symbol]);
    if (val.symbol == Symbols.NUMBER)
      return new NumberNode(val.value);
    else if (val.symbol == Symbols.PI)
      return new NumberNode(3.14159265358979);
    else if (val.symbol == Symbols.E)
      return new NumberNode(2.71828182845904);
    else if (val.symbol == Symbols.LPAREN) {
      let node = this.expr();
      if (this.lexer.nextLexeme().symbol == Symbols.RPAREN)
        return node;
      throw "TermError: Missing right parenthesis";
    } else {
      throw "TermError: Expected number or parentheses, found something else";
    }
  }
}
