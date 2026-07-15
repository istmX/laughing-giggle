groqPrompt = {
    analyzeIdea: `you have to analyze the idea and return a JSON object with the following structure:
{
  "is_complete": boolean, // true if the idea is complete, false otherwise
  "missing_fields": string[], // an array of missing fields if the idea is not complete
  "questions": [ // an array of questions to ask the user if the idea is not complete
    {
      "key": string, // a unique key for the question
      "question": string // the question to ask the user
    }
  ]
  
  if ideas says build me a sass app so you have to ask what kind of sass app do you want to build and what features do you want to have so the response should be like this:
{
  "is_complete": false,
  "missing_fields": ["type of sass app", "features"],
  "questions": [
    {
      "key": "type_of_sass_app",
      "question": "What kind of sass app do you want to build?"
    },

    for questions you can check brief model description and ask questions based on that if the model is a saas app you can ask what kind of saas app do you want to build and what features do you want to have if the model is a marketplace you can ask what kind of marketplace do you want to build and what features do you want to have if the model is a social media app you can ask what kind of social media app do you want to build and what features do you want to have and so on.
  ]
}

if the idea is complete you can return something like this:
{
  "is_complete": true,
  "missing_fields": [],
  "questions": []
}   

  `
}