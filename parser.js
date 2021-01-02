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

const __PI = 3.14159265358979;
const __E = 2.71828182845904;

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
      try {
        let op = this.lexer.nextLexeme();
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
      } catch (error) {
        throw new ParseError("Ran out of symbols");
      }
      
    }
    return lhs;
  }

  term() {
    try {
      let val = this.lexer.nextLexeme();
      let negative = false;
      if (val.symbol == Symbols.MINUS) {
        negative = true;
        val = this.lexer.nextLexeme();
      }
  
      if (val.symbol == Symbols.NUMBER)
        return new NumberNode(negative ? -val.value : val.value);
      else if (val.symbol == Symbols.PI)
        return new NumberNode(negative ? -__PI : __PI);
      else if (val.symbol == Symbols.E)
        return new NumberNode(negative ? -__E : __E);
      else if (val.symbol == Symbols.LPAREN) {
        let node = this.expr();
        if (node != null && this.lexer.nextLexeme().symbol == Symbols.RPAREN)
          return node;
        else
          throw new ParseError("Missing right parenthesis");
      }
    } catch (error) {
      throw new ParseError("Expected number or parentheses, got something else");
    }
    
  }
}

class ParseError extends Error {
  constructor(message) {
    super(message);
    this.name = "ParseError";
  }
}