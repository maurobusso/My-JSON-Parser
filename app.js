//check if valid JSON object


//tokenize the input returning an array of tokens 
//go though the array of token and return the correct thing


const tokenType = {
    NUMBER : '0123456789',
}

function lexerJSON(input) {

    let tokens = [];
    let currentString = ''
    let insideString = false
    
    //console.log(input)

    for(let i = 0; i < input.length; i++){
        //console.log(input[i])

        //handel strings
        if( input[i] === '"' && !insideString ){

            insideString = true
            currentString = ''  

        }else if( input[i] === '"' && insideString){

            insideString = false
            tokens.push(currentString)

        }else if(insideString){

            currentString += input[i]

        }else if(input[i] === ' ' ||
                 input[i] === '\t' || 
                 input[i] === '\n' || 
                 input[i] === '\r'){
            continue
        }else if(input[i] === 't' && 
                 input[i + 1] === 'r' &&
                 input[i + 2] === 'u' &&
                 input[i + 3] === 'e' ){

            tokens.push(true)
            i += 3
        }else if(input[i] === 'f' &&
                 input[i + 1] === 'a' &&
                 input[i + 2] === 'l' && 
                 input[i + 3] === 's' && 
                 input[i + 4] === 'e'){

            tokens.push(false)
            i += 4
        }else if(input[i] === 'n' &&
                 input[i + 1] === 'u' &&
                 input[i + 2] === 'l' &&
                 input[i + 3] === 'l' ){

            tokens.push(null)
            i += 3
        }else if( tokenType.NUMBER.includes(input[i]) ){
            //need to handle floats

            let number = ''

            while( tokenType.NUMBER.includes(input[i]) ){
                number += input[i]
                i++
            }

            if( isNaN(number) || number[0] == '0'){
                throw new Error('Error in parsing the number')
            }

            tokens.push(parseFloat(number))
            if(input[i] === ','){
                tokens.push(',')
            }

        }else{
            tokens.push(input[i])
        }
    }
    //console.log(tokens)
    return tokens
}


//fucntions are designed to return a value and an array of the remaining of the array not yet parsed
function parseValue(input){
    //console.log(input)
    let current = input[0]

    if(current === '{'){
        return parseObject(input.slice(1))
    }else if(current === '['){
        return parseArray(input.slice(1))
    }else if(typeof current === 'string' ||
             typeof current === 'number' || 
             typeof current === 'boolean' || 
             current === null )          
                {
        return [current, input.slice(1)]
    }else{
        throw new Error(`unexpected token: ${current}`)
    }
    
}

function parseArray(input){
    let arr = []
    let current = input[0]

    if(input.length > 1 && current === ']'){
        return [arr, input.slice(1)]
    }

    while(current !== ']'){
        let [arrVal, remainingInput] = parseValue(input);
        arr.push(arrVal);

        current = remainingInput[0];
        if (current === ']') {
            return [arr, remainingInput.slice(1)];
        } else if (current !== ',') {
            throw new Error('Expected comma after object in array');
        }

        input = remainingInput.slice(1);
    }
}

function parseObject(input){
    let obj = {}
    let current = input[0]

    if(current === '}'){
        return [obj, input.slice(1)]
    }

    while( input.length > 1 && current !== '}'){
        
        let jsonKey = input[0];
        if (typeof jsonKey === 'string') {
            input = input.slice(1);
        } else {
            throw new Error(`Expected string key, got: ${jsonKey}`);
        }

        if (input[0] !== ':') {
            throw new Error(`Expected colon after key in object, got: ${current}`);
        }

        let [jsonValue, remainingInput] = parseValue(input.slice(1));

        obj[jsonKey] = jsonValue;

        current = remainingInput[0];
        if (current === '}') {
            return [obj, remainingInput.slice(1)];
        } else if (current !== ',') {
            throw new Error(`Expected comma after pair in object, got: ${current}`);
        }

        input = remainingInput.slice(1);
    }

    return obj
}

module.exports.lexerJSON = lexerJSON
module.exports.parseValue = parseValue