const inputText = document.getElementById("messageField");
const setName = document.querySelector("#setName");

const setCharacter = document.getElementById("poo");

const setFeeling = document.querySelector("#setFeeling");

// variable current un
let nickname;

// use webSocket >>> make sure server uses same ws port
const websocket = new WebSocket("ws://localhost:80");



/* Event listeners */

// Open connection
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

    // listen to message from client, server
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
        // press Enter and need to have at least one character
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

        // reach content
        let newMsg = template.content;

        // change content
        newMsg.querySelector("span").textContent = obj.nickname;
        newMsg.querySelector("p").textContent = obj.msg;
        // newMsg.querySelector("i").textContent = obj.feeling;

        // new date
        let objDate = new Date();

        // visual time, get time
        newMsg.querySelector("time").textContent = 
        objDate.getHours() + ":" + objDate.getMinutes();

        // set datetime
        newMsg
        .querySelector("time")
        .setAttribute("datetime", objDate.toISOString());

        // render using prepend method - last message 
        document.getElementById("chatConversation").append(newMsg);
    }

    /* CANVAS FUNCTIONS */

    function init(e) {
        // get canvas
        const canvas = document.querySelector("#canvas");
        const ctx = canvas.getContext("2d");
      
        // make dots
        let isPainting = false;
        const initPaint = (e) => {
          isPainting = true;
          paint(e); 
        };
      
        const finishPaint = () => {
          isPainting = false;
        };
      
        const paint = (e) => {

            if (!isPainting) return;
            const args = {x: e.clientX, y: e.clientY, radius:10, startAngle:0, endAngle: 2 * Math.PI};
            websocket.send(JSON.stringify({ type: "paint", payload: args }));
          
            // draw circles
            ctx.arc(e.clientX, e.clientY, 10, 0, 2 * Math.PI); 
           
            ctx.fill();

            ctx.beginPath();
          };
      

    
        const handleSocketOpen = (e) => {
            console.log('Socket has been opened');
          };
         
          // CHECK THIS ONE AGAIN
          const handleSocketMessage = (e) => {
            const message = JSON.parse(e.data);
            console.log(`Message incoming: ${message}`);
            switch (message.type) {
              case "paint":
                const args = message.payload;
                // paint when told by server
                paintDot(ctx, args); 
                break;
              default:
                console.log("default case...");
            }
          }
      
        // con events w func
        websocket.onopen = handleSocketOpen;
        websocket.onmessage = handleSocketMessage;
        canvas.onmousedown = initPaint
        canvas.onmousemove = paint
        canvas.onmouseup = finishPaint

      }

      function paintDot(ctx, args) {
        ctx.arc(args.x, args.y, args.radius, args.startAngle, args.endAngle);
        ctx.fill();
        ctx.beginPath();


        console.log(ctx);
      }
      
      window.onload = init;