import inquirer from 'inquirer';
import fs from 'fs';

interface Answer {
  inputType: string;
  input: string;
}

const prompt = async () => {
  const { inputType, input } = await inquirer.prompt<Answer>([
    {
      type: 'list',
      name: 'inputType',
      message: 'What type of input would you like to provide?',
      choices: ['Text file', 'PDF file', 'URL']
    },
    {
      type: 'input',
      name: 'input',
      message: 'Enter the path to your text file:',
      validate: (input) => fs.existsSync(input) && fs.statSync(input).isFile(),
      when: (answers) => answers.inputType === 'Text file',
      filter: (input) => input.trim(),
      transformer: (input) => {
        const isTextFile = input.toLowerCase().endsWith('.txt');
        const message = isTextFile ? `${input} (text file)` : input;
        return isTextFile ? message.green : message;
      },
      suffix: '  (only shows .txt files)',
      source: (answersSoFar: any, input: string) => {
        if (!input) {
          return Promise.resolve([]);
        }
        const txtFiles = fs.readdirSync(process.cwd()).filter((f) => f.toLowerCase().endsWith('.txt'));
        return Promise.resolve(txtFiles.filter((f) => f.startsWith(input)));
      }
    },
    {
      type: 'input',
      name: 'input',
      message: 'Enter the path to your PDF file:',
      validate: (input) => fs.existsSync(input) && fs.statSync(input).isFile(),
      when: (answers) => answers.inputType === 'PDF file',
    },
    {
      type: 'input',
      name: 'input',
      message: 'Enter your URL:',
      validate: (input) => input.startsWith('http://') || input.startsWith('https://'),
      when: (answers) => answers.inputType === 'URL'
    }
  ]);

  console.log(`You chose ${inputType} input: ${input}`);
};

prompt();
