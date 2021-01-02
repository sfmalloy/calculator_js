const Symbols = Object.freeze({
  PLUS: 0,
  MINUS: 1,
  TIMES: 2,
  DIVIDES: 3,
  POWER: 4,
  LPAREN: 5,
  RPAREN: 6,
  NUMBER: 7,
  PI: 8,
  E: 9 
});

// Constants
const names = ['PLUS', 'MINUS', 'TIMES', 'DIVIDES', 'POWER', 'LPAREN', 'RPAREN', 'NUMBER', 'PI', 'E'];
const precedences = [0, 0, 1, 1, 2];
const LTR_ASSOC = 0;
const RTL_ASSOC = 1;

class Lexeme {
  constructor(symbol, value=null) {
    this.symbol = symbol;
    this.value = value;

    if (this.value != null)
      this.value = parseFloat(this.value);
  }

  toString() {
    let name = names[this.symbol];
    if (this.symbol == Symbols.NUMBER)
      return `${name}(${this.value})`;
    return `${name}`;
  }

  isOperator() {
    return this.symbol <= Symbols.POWER;
  }

  precedence() {
    return precedences[this.symbol];
  }

  association() {
    return this.symbol != Symbols.POWER ? LTR_ASSOC : RTL_ASSOC;
  }
}

class Lexer {
  constructor(expression) {
    this.idx = 0;
    this.expression = expression;
    this.lexemes = new Array();
    this.analyze();
  }

  isNumber(str) {
    return !isNaN(parseFloat(str)) && isFinite(str);
  }

  nextLexeme() {
    if (this.idx < this.lexemes.length)
      return this.lexemes[this.idx++];
    return null;
  }

  decrement() {
    this.idx--;
  }

  hasLexemes() {
    return this.idx < this.lexemes.length;
  }

  analyze() {
    for (let i = 0; i < this.expression.length; ++i) {
      if (this.expression[i] === '+') {
        this.lexemes.push(new Lexeme(Symbols.PLUS));
      } else if (this.expression[i] === '-') {
        this.lexemes.push(new Lexeme(Symbols.MINUS));
      } else if (this.expression[i] === '*') {
        this.lexemes.push(new Lexeme(Symbols.TIMES));
      } else if (this.expression[i] === '/') {
        this.lexemes.push(new Lexeme(Symbols.DIVIDES));
      } else if (this.expression[i] === '^') {
        this.lexemes.push(new Lexeme(Symbols.POWER));
      } else if (this.expression[i] === '(') {
        this.lexemes.push(new Lexeme(Symbols.LPAREN));
      } else if (this.expression[i] === ')') {
        this.lexemes.push(new Lexeme(Symbols.RPAREN));
      } else if (i < this.expression.length && this.expression[i] === 'p' && this.expression[i+1] === 'i') {
        this.lexemes.push(new Lexeme(Symbols.PI));
        ++i;
      } else if (this.expression[i] === 'e') {
        this.lexemes.push(new Lexeme(Symbols.E));
      } else if (this.isNumber(this.expression[i])) {
        let dotCount = 0;
        let begin = i;
        let end = i;
        while (end < this.expression.length && dotCount < 2 && this.expression[end] !== ' ') {
          if (this.expression[end] === '.') {
            dotCount += 1;
          } else if (!this.isNumber(this.expression[end])) {
            break;
          }
          
          ++end;
        }
        
        if (dotCount < 2) {
          this.lexemes.push(new Lexeme(Symbols.NUMBER, this.expression.slice(begin, end)));
        } else {
          throw new LexerError("Too many decimal points");
        }

        i = end;
        if (this.expression[end] !== ' ')
          i -= 1;
      } else if (this.expression[i] !== ' ') {
        throw new LexerError(`Unknown symbol found (${this.expression[i]})`);
      }
    }
    
    return this.lexemes;
  }
}

class LexerError extends Error {
  constructor(message) {
    super(message);
    this.name = "LexerError";
  }
}