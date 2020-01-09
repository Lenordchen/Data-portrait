function setup () {
  loadStrings('writing.txt', loadText);
}

let counts = {};
let keys = [];

function loadText(myText){
  //console.log(myText);

  let allwords = myText.join("\n");
  let tokens = allwords.split(/\W+/);

  //console.log(tokens);

  for (let i = 0; i < tokens.length; i++){
     let eachWord = tokens[i].toLowerCase();
     if (!/\d+/.test(eachWord)){
         if (counts[eachWord] === undefined) {
           counts[eachWord] = 1;
           keys.push(eachWord);
         } else {
           counts[eachWord] = counts[eachWord] + 1;
         }
      }
  }
  keys.sort(compare);

  function compare(a,b){
    let countA = counts[a];
    let countB = counts[b];

    return countB - countA;
  }

  for (let i = 0; i < keys.length; i++) {
    let key = keys[i];
    console.log(key + " " + counts[key]);
  }
}
