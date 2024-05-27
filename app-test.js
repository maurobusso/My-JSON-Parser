const fs = require('fs');
const path = require('path');
const { lexerJSON, parseValue }= require('./app');

function run(directoryPath) {
    // Read the content of the directory
    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            console.error('Error reading the directory:', err);
            return;
        }

        // Iterate over each file or directory in the current directory
        files.forEach(file => {
            const filePath = path.join(directoryPath, file);

            // Check if the current item is a directory
            fs.stat(filePath, (err, stats) => {
                if (err) {
                    console.error('Error checking file stats:', err);
                    return;
                }

                if (stats.isDirectory()) {
                    // Recursively call run function for subdirectories
                    run(filePath);
                } else {
                    // Read the content of the file
                    fs.readFile(filePath, 'utf8', (err, fileContent) => {
                        if (err) {
                            console.error('Error reading the file:', err);
                            return;
                        }

                        // Call function with the input data
                        const lexerOutput = lexerJSON(fileContent);
                        const parseOutput = parseValue(lexerOutput)

                        // Log the output
                        // parseOutput[0] it always return an array of 2 elements 
                        console.log('Output for file:', filePath, '\n', parseOutput[0]);
                    });
                }
            });
        });
    });
}


// run("tests/step1")
// run("tests/step2")
// run("tests/step3")
// run("tests/step4")
 run("tests/step5")

 //at the moment it doesnt handle floats 