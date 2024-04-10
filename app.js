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



function parseValue(input){
    //console.log(input)

    for(let i = 0; i < input.length; i++){

        if(input[i] === '{'){
            return parseObject(input.slice(i))
        }else if(input[i] === '['){
            return parseArray(input.slice(i))
        }else if(typeof input[i] === 'string' ||
                 typeof input[i] === 'number' || 
                 typeof input[i] === 'boolean' || 
                 input[i] === null)
                 {
            return input[i]
        }else{
            throw new Error(`unexpected token: ${input[i]}`)
        }
    }
}

function parseArray(input){
    
    console.log(`input for the parse arr func`, input)
    let arr = []
    let i = 0

    while( i < input.length && input[i] !== ']' ){

        let parseResult = parseValue(input.slice(i))
        arr.push(parseResult)   
        i++

        if(input[i] === ','){
            i++
        } 
        // else if(input[i] === '['){
        //     let parseResult = parseValue(input.slice(i))
        //     arr.push(parseResult)    
        //     i+= parseResult.length + 2
        // }else if( input[i] ){
        //     //let parseResult = parseJSON(input[i])
        //     arr.push(input[i])
        //     //i+= parseResult.length
        // }
    }    
    return arr
}

function parseObject(input){
    //console.log(`input in parseObject function`, input)
    let object = {}
    let i = 0
    
    while ( i < input.length && input[i] !== '}' ) {
        
        // if(typeof input[i] === 'string' && input[i + 1] === ':' ){        
        //     const key = input[i]
        //     i += 2
        //     const value = parseValue(input.slice(i))
        //     object[key] = value

            // Parse key-value pairs
        const keyResult = parseValue(input.slice(i));
        const valueResult = parseValue(input.slice(i + keyResult.length + 1)); // Skip the key and ':'
        object[keyResult.value] = valueResult.value;
        i += keyResult.length + valueResult.length + 1; // Move index by total length

            
        }
        
        if (input[i] === ',') {
            i++
        }
    return object
}



module.exports.lexerJSON = lexerJSON
module.exports.parseValue = parseValue