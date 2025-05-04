
const http = require('http');
const OLLAMA_API_URL = 'http://localhost:11434';

function prompt({url, payload, onStream, onEnd}) {
  const answer = [];

  const req = http.request(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  }, (res) => {
    res.on('data', (chunk) => {
      const jsonChunk = JSON.parse(chunk.toString());
      answer.push(jsonChunk.response);
      onStream(jsonChunk.response);
    });

    res.on('end', (chunk) => onEnd(answer.join('')));
  });

  req.write(JSON.stringify(payload));
  req.end();
}

function init(promptText) {
  prompt({
    url: `${OLLAMA_API_URL}/api/generate`, 
    payload: { prompt: promptText, model: 'llama3.2' }, 
    onStream: (partial) => console.log(partial), 
    onEnd: (finalResponse) => console.log(finalResponse),
  });
}

init('tell me a joke');