lex = new Lexer();

document.addEventListener('keyup', (key) => {
  if (key.code == 'Enter') {
    let arr = lex.analyze(document.getElementById('expression').value);
    let outStr = '';
    for (let i = 0; i < arr.length; ++i) {
      outStr += '<p>' + arr[i].toString() + '</p>';
    }

    document.getElementById('output').innerHTML = outStr;
  }
});
