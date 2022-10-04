// DOM elements
const inputText = document.getElementById("messageField");
const setName = document.querySelector("#setName");

const setCharacter = document.getElementById("poo");

const setFeeling = document.querySelector("#setFeeling");

// variable current user | name
let nickname;

// use webSocket >>> make sure server uses same ws port
const websocket = new WebSocket("ws://localhost:80");



/* Event listeners */

//Connection opened
websocket.addEventListener("open", (event) => {
    console.log("Connected to server");
    document.getElementById("status").textContent = "Server is running.";
  });


  setName.addEventListener("click", () => {
    //get value from input name
    nickname = document.getElementById("name").value;

    console.log("Your name is: ", nickname);
    
    // if set - disable input name
    document.getElementById("name").setAttribute("disabled", true);

    // enable input field
    document.getElementById("messageField").removeAttribute("disabled");

    // focus input field
    document.getElementById("messageField").focus();
});

// setCharacter.addEventListener("click", () => {
//     console.log("You clicked on poo");
// })

// setFeeling.addEventListener("click", () => {
//     // get value from input
//     feeling = document.getElementById("feeling").value;

//     console.log("You feel:  ", feeling);

//     document.getElementById("messageField").focus();
// })

// listen on close event (server)
// websocket.addEventListener("close", (event) => {
//     console.log("Server down... ", event);
//     document.getElementById("status").textContent = "Sorry, server is down.";

    // listen to message from client | server
    websocket.addEventListener("message", (event) => {
        console.log(event.data);

        let obj = parseJSON(event.data);

        // todo
        // use obj property "type" to handle message event
        switch (obj.type) {
            case "text": 
                break;
            case "somethingelse":
                break;
            default:
                break;
        }

        renderMessage(obj);
    });



   


    inputText.addEventListener("keydown", (event) => {
        // press Enter, make sure at least one character
        if (event.key === "Enter" && inputText.value.length > 0) {
            // chat message obj
            let objMessage = {
                msg: inputText.value,
                nickname: nickname
            };

            // show new message for user
            renderMessage(objMessage);

            // send to server
            websocket.send(JSON.stringify(objMessage));

            // reset input field 
            inputText.value;
        }
    });


    /* Functions */

    /**
 * parse JSON
 *
 * @param {*} data
 * @return {obj}
 */

    function parseJSON(data) {
        // try to parse json
        try {
            let obj = JSON.parse(data);

            return obj;
        } catch (error) {
            // log to file in real application
            return { error: "An error receiving data, expected json format" }; 
        }
    }

    /**
 * render new message
 *
 * @param {obj}
 */

    function renderMessage(obj) {
        // use template - cloneNode to get a document fragment
        let template = document.getElementById("message").cloneNode(true);

        // access content
        let newMsg = template.content;

        // change content
        newMsg.querySelector("span").textContent = obj.nickname;
        newMsg.querySelector("p").textContent = obj.msg;
        // newMsg.querySelector("i").textContent = obj.feeling;

        // new date object
        let objDate = new Date();

        // visual time, leading zero
        newMsg.querySelector("time").textContent = 
        objDate.getHours() + ":" + objDate.getMinutes();

        // set datetime attribute - see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/time
        newMsg
        .querySelector("time")
        .setAttribute("datetime", objDate.toISOString());

        // render using prepend method - last message 
        document.getElementById("chatConversation").append(newMsg);
    }

