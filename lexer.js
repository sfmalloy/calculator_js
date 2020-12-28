// For debugging purposes only, switch to numerical enum for release
const Symbols = Object.freeze({
  PLUS: "PLUS",
  MINUS: "MINUS",
  TIMES: "TIMES",
  DIVIDES: "DIVIDES",
  POWER: "POWER",
  LPAREN: "LPAREN",
  RPAREN: "RPAREN",
  NUMBER: "NUMBER",
  PI: "PI",
  E: "E"
});

// const Symbols = Object.freeze({
//   PLUS: 0,
//   MINUS: 1,
//   TIMES: 2,
//   DIVIDES: 3,
//   POWER: 4,
//   LPAREN: 5,
//   RPAREN: 6,
//   NUMBER: 7,
//   PI: 8,
//   E: 9 
// });

class Lexeme {
  constructor(symbol, value=null) {
    this.symbol = symbol;
    this.value = value;

    if (this.value != null)
      this.value = parseFloat(this.value);
  }

  toString() {
    if (this.symbol == Symbols.NUMBER) {
      return `${this.symbol}(${this.value})`;
    }
    return `${this.symbol}`;
  }
}

class Lexer {
  constructor() { }

  analyze(expression) {
    let lexemes = Array();
    for (let i = 0; i < expression.length; ++i) {
      if (expression[i] == '+') {
        lexemes.push(new Lexeme(Symbols.PLUS));
      } else if (expression[i] == '-') {
        lexemes.push(new Lexeme(Symbols.MINUS));
      } else if (expression[i] == '*') {
        lexemes.push(new Lexeme(Symbols.TIMES));
      } else if (expression[i] == '*') {
        lexemes.push(new Lexeme(Symbols.TIMES));
      } else if (expression[i] == '/') {
        lexemes.push(new Lexeme(Symbols.DIVIDES));
      } else if (expression[i] == '^') {
        lexemes.push(new Lexeme(Symbols.POWER));
      } else if (expression[i] == '(') {
        lexemes.push(new Lexeme(Symbols.LPAREN));
      } else if (expression[i] == ')') {
        lexemes.push(new Lexeme(Symbols.RPAREN));
      } else if (i < expression.length && expression[i] == 'p' && expression[i+1] == 'i') {
        lexemes.push(new Lexeme(Symbols.PI));
      } else if (expression[i] == 'e') {
        lexemes.push(new Lexeme(Symbols.E));
      } else if (expression[i] != ' ') {
        let dotCount = 0;
        let begin = i;
        let end = i;
        while (end < expression.length && dotCount < 2 && expression[end] != ' ') {
          if (expression[end] == '.') {
            dotCount += 1;
          } else if (!(!isNaN(parseFloat(expression[end])) && isFinite(expression[end]))) {
            break;
          }
          
          ++end;
        }
        
        if (dotCount < 2) {
          lexemes.push(new Lexeme(Symbols.NUMBER, expression.slice(begin, end)));
        }

        i = end;
        if (expression[end] != ' ')
          i -= 1;
      }
    }
    
    lexemes.forEach(console.log);
    console.log(lexemes.length);

    return lexemes;
  }
}