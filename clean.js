const fs = require('fs');

const text = fs.readFileSync('writting.txt', 'utf-8');
// console.log(text);
let counts = {};

let textLine = text.split("\n");

let allwords = textLine.join("\n");
let tokens = allwords.split(/\s+/);

//console.log(tokens);

for (let i = 0; i < tokens.length; i++){
   let eachWord = tokens[i].toLowerCase();
   if (!/\d+/.test(eachWord)){
       if (counts[eachWord] === undefined) {
         counts[eachWord] = 1;
       } else {
         counts[eachWord] = counts[eachWord] + 1;
       }
    }

   // console.log(counts);
}


let myArr = [];
let numArr = [];

let indexEnd = 0;
let indexStart = 0;
let quoteRegEx = /([""])(\\?.)*?\1/g;
let quoteRegExVal;
let word = /(\w+)/g;
let wordCount;
let convo;



for (let i = 0; i < textLine.length; i++) {

    let myObj = {};

    //let nextDateArray = textLine[i].split("(");
    let nextDateArray = textLine[i].split("(");

    if(nextDateArray.length > 1 && i != indexStart) {
      indexEnd = i;
      // console.log("indexStart: " + indexStart);
      // console.log("indexEnd: " + indexEnd);
      let sumCount = 0;

      // QUOTES RANGING FROM indexStart TO indexEnd
      for (let j = indexStart; j < indexEnd; j++){
        quoteRegExVal = textLine[j].match(quoteRegEx);
        if(quoteRegExVal){
          convo = quoteRegExVal;
          //console.log(convo);
          myObj.Quote = convo;
          // console.log(quoteRegExVal);
        }

        //let sumCount = 0;
        wordCount = textLine[j].match(word);
        if (wordCount){
           // console.log(wordCount.length);
           sumCount += wordCount.length
         }


      }
      // console.log("sum is ",sumCount );

      let dateArray = textLine[indexStart].split("(");
      myObj.Time = dateArray[0].split("(")[0];

        // console.log(myObj.Time);

        myObj.Location = dateArray[1].split(")")[0];
        // console.log(myObj.Location);


        myObj.Wordcount = sumCount;

        myArr.push(myObj);

                //console.log(textLine.length);
  }

        indexStart = indexEnd;
}



fs.writeFileSync('writingNew.json', JSON.stringify(myArr), 'utf-8')
