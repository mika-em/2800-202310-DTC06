// app.get('/persona', (req, res) => {
//     res.render("persona");
// });

// app.get('/persona/general-prompt', (req, res) => {
//     console.log(chatPrompt)
//     res.render("generalPrompt");
// });

// app.post('/persona/general-prompt', (req, res) => {
//     const name = req.body.name || "random";
//     const age = req.body.age || "random";
//     const gender = req.body.gender || "random";
//     const situation = req.body.plot || "random";
//     const plot = req.body.plot || "random";

//     const message = `Generate a ${gender} character whose name is ${name} and age is ${age}, and is in a ${plot} setting where they are faced with ${situation}.`;
//     chatPrompt.push("You: " + message);
//     chatPrompt.push("hello");
//     console.log(chatPrompt)

//     // placeholder for db for chatPrompt/chatHistory
//     res.redirect('/persona/chat');
// });

// app.get('/persona/saved-prompt', (req, res) => {
//     res.render("savedPrompt");
// });

// app.get('/persona/new-prompt', (req, res) => {
//     res.render("newPrompt");
// });

// app.post('/persona/new-prompt', (req, res) => {
//     // placeholder for db for chatPrompt/chatHistory
//     const parameter = req.body.parameter;
//     savedPromptParameter.push(parameter);
//     console.log(savedPromptParameter);
//     res.render("newPrompt");
// });

// app.get('/persona/chat', (req, res) => {
//     // placeholder for db for chatPrompt/chatHistory
//     console.log(chatPrompt);
//     res.render("chat");
// });

// app.post('/persona/chat', (req, res) => {
//     // placeholder for db for chatPrompt/chatHistory
//     const message = req.body.message;
//     chatPrompt.push("You: " + message);
//     console.log(chatPrompt);
//     res.render("chat");
// });