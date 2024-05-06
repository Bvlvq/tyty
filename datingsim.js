const chatbox = document.querySelector(".chat-container .chat-box");
const inputRecorder = document.querySelector(".input-recorder .input-msg");
const chatInput = document.querySelector(".input-container textarea");
const sendChatBtn = document.querySelector(".input-container span");

var bfName = localStorage.getItem('boyfriendName');

var spanElement = document.getElementById("bf-name").getElementsByTagName("span")[0];
spanElement.innerHTML = bfName;

var spanElementBg = document.getElementById("bf-name-bg").getElementsByTagName("span")[0];
spanElementBg.innerHTML = bfName;

var personalities = localStorage.getItem('personalities');
var talk = localStorage.getItem('talk');
var hobbies = localStorage.getItem('hobbies');
var emotion = localStorage.getItem('emotion');

var bfImageNew = localStorage.getItem('bfImage');
var bfImage = document.getElementById("bf");
bfImage.src = bfImageNew;



const transition_el_1 = document.querySelector('.transition-1');
const transition_el_2 = document.querySelector('.transition-2');

window.onload = () => {
    setTimeout(() => {
        transition_el_1.classList.replace('is-active', 'leave');
    })
}


let logo = document.getElementById('logo');
let home = document.getElementById('home');

const handleTransition = (e) => {
    e.preventDefault();

    transition_el_2.classList.add('is-active');

    setTimeout(() => {
        window.location.href = `home.html`;
    }, 500);
};

logo.addEventListener('click', handleTransition);
home.addEventListener('click', handleTransition);



let botId;

document.addEventListener("DOMContentLoaded", function() {
    // Function to get URL parameter by name
    const getUrlParameter = (name) => {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        const results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    };

    // Get botId parameter from the URL
    botId = getUrlParameter('id');

    // Function to fetch chat data from localStorage based on botId
    const fetchChatDataForBot = (botId) => {
        const data = localStorage.getItem("chatData");
        const chatData = data ? JSON.parse(data) : null;
        console.log(chatData);
        return chatData && chatData[botId] ? chatData[botId] : null;
    };

    // Get chat data for the specified botId
    const chatDataForBot = fetchChatDataForBot(botId);

    

   
    
    // Now you have the chat data for the specified botId, you can use it as needed.
    console.log(chatDataForBot);

    // Get the last message from the bot if conversation history exists
    const lastBotMessage = chatDataForBot && chatDataForBot.conversations.length > 0 ? chatDataForBot.conversations[chatDataForBot.conversations.length - 1].message : null;
    console.log("Last bot message:", lastBotMessage);

    // Get the last message from the user if conversation history exists
    const lastUserMessage = chatDataForBot && chatDataForBot.conversations.length > 1 ? chatDataForBot.conversations[chatDataForBot.conversations.length - 2].message : null;
    console.log("Last user message:", lastUserMessage);
    // Append the user's message to the input recorder




    const createChatLi = (message, className) => {
        // Create a chat <li> element with passed message and className
        const chatLi = document.createElement("p");
        chatLi.classList.add("chat", `${className}`);
        chatLi.textContent = message;
        return chatLi; // return chat <li> element
    }

    if (lastUserMessage) {
        const userMessageLi = createChatLi(lastUserMessage, "outgoing");
        inputRecorder.innerHTML = "";
        inputRecorder.appendChild(userMessageLi);
    }

    if (lastBotMessage) {
        const botMessageLi = createChatLi(lastBotMessage, "incoming");
        chatbox.appendChild(botMessageLi);
    }

    const botImage = chatDataForBot ? chatDataForBot.botImage : ""; // Assuming botImage is stored in chatData
    const botName = chatDataForBot ? chatDataForBot.botName : ""; // Assuming botName is stored in chatData

    // Set the bot's image and name
    bfImage.src = botImage;
    spanElement.innerHTML = botName;
    spanElementBg.innerHTML = botName;

    let conversationMemory = [];
    const MAX_MEMORY_SIZE = 5;

    // Get the last 5 user and bot messages
    if (chatDataForBot) {
        const conversations = chatDataForBot.conversations;
        const numMessages = conversations.length;

        // Get the last 5 messages from the end of the conversation history
        const startIndex = Math.max(0, numMessages - 10);

        for (let i = startIndex; i < numMessages; i++) {
            const message = conversations[i].message; // Extract the message string
            const role = conversations[i].role;

            // Add user and bot messages to conversationMemory
            conversationMemory.push(message);
        }
    }
    

    // Now conversationMemory contains the last 5 messages from the user and bot
    console.log(conversationMemory);


    let userMessage = null; // Variable to store user's message
    const API_KEY = "LMAOOOOOOOOOOO U DONT HAVE THE API KEY";
    const inputInitHeight = chatInput.scrollHeight;

        // Replace with your actual API Gateway endpoint URL
const API_GATEWAY_URL = 'https://znx1pasuye.execute-api.us-west-2.amazonaws.com/dev/chat';

const generateResponse = (userMessage) => {
    // Define the properties and message for the API request
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'gpt-4',
            messages: [
                {
                    role: 'system',
                    content: `Roleplay as my boyfriend. Your name is ${bfName}. The user's name is Brandon. Your personalities are ${personalities}. The ways you talk to the user are ${talk}. The user's hobbies are ${hobbies}. Make conversations around their hobbies. The emotional support you give is ${emotion}. Respond with at most 2 sentences.`
                },
                {
                    role: 'assistant',
                    content: conversationMemory.join('')
                },
                {
                    role: 'user',
                    content: userMessage
                }
            ]
        })
    };

    // Send POST request to API Gateway, get response, and append the response to the chatbox
    fetch(API_GATEWAY_URL, requestOptions)
        .then(res => res.json())
        .then(data => {
            const botResponse = data.choices[0].message.content.trim();
            addToConversation(botId, botResponse, 'assistant');

            conversationMemory.push(userMessage, botResponse);

            if (conversationMemory.length > 2 * MAX_MEMORY_SIZE) {
                conversationMemory.splice(0, conversationMemory.length - 2 * MAX_MEMORY_SIZE);
            }
            console.log('NEW: ' + conversationMemory);

            // Clear existing messages in the chat container
            chatbox.innerHTML = '';

            // Create a <p> element to hold the incoming message
            const chatLi = document.createElement('li');
            chatLi.classList.add('chat', 'incoming');
            const chatParagraph = document.createElement('p');
            chatLi.appendChild(chatParagraph);
            chatbox.appendChild(chatLi);

            // Split the message into individual characters
            const characters = botResponse.split('');
            let i = 0;

            // Create a function to append characters one by one with a delay
            const textSpeed = () => {
                if (i < characters.length) {
                    chatParagraph.textContent += characters[i];
                    chatbox.scrollTo(0, chatbox.scrollHeight);
                    i++;
                    setTimeout(textSpeed, 10); // Adjust the delay between characters (in milliseconds)
                }
            };

            // Start the typewriter effect
            textSpeed();
        })
        .catch(() => {
            const errorMessage = '[Connection Issue] Womp Womp... Your boyfriend is having problems :(';
            const chatLi = createChatLi(errorMessage, 'error');
            chatbox.appendChild(chatLi);
            chatbox.scrollTo(0, chatbox.scrollHeight);
        });
};




    const handleChat = () => {
        userMessage = chatInput.value.trim(); // Get user entered message and remove extra whitespace
        if (!userMessage) return;

        // Clear the input textarea and set its height to default
        chatInput.value = "";
        chatInput.style.height = `${inputInitHeight}px`;

        // Append the user's message to the input recorder
        const userMessageLi = createChatLi(userMessage, "outgoing");
        inputRecorder.innerHTML = "";
        inputRecorder.appendChild(userMessageLi);

        addToConversation(botId, userMessage, "user");
        // Generate response and append it to the chatbox
        generateResponse(userMessage);
    }

    chatInput.addEventListener("input", () => {
        // Adjust the height of the input textarea based on its content
        chatInput.style.height = `${inputInitHeight}px`;
        chatInput.style.height = `${chatInput.scrollHeight}px`;
    });

    chatInput.addEventListener("keydown", (e) => {
        // If Enter key is pressed without Shift key and the window 
        // width is greater than 800px, handle the chat
        if(e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
            e.preventDefault();
            handleChat();
        }
    });

    var showText = function (target, message, index, interval) {
        if (index < message. length) {
            $(target).append(message[index++]);
            setTimeout(function () {showText(target, message, index, interval); }, interval);
        }
    }

    sendChatBtn.addEventListener("click", handleChat);

    const inputRecorderContainer = document.getElementById("input-recorder");
    const showUserBtn = document.getElementById("show-user-btn");

    let isClosed = false;

    showUserBtn.addEventListener("click", () => {
        isClosed = !isClosed;
        inputRecorderContainer.classList.toggle("closed", isClosed);
        showUserBtn.classList.toggle("closed", isClosed);
    });

    const saveChatData = (data) => {
        localStorage.setItem("chatData", JSON.stringify(data));
    }

    const loadChatData = () => {
        const data = localStorage.getItem("chatData");
        return data ? JSON.parse(data) : null;
    }

    let chatData = loadChatData() || {
        botName: bfName,
        botSettings: {
            personalities: personalities,
            talk: talk,
            hobbies: hobbies,
            emotion: emotion
        },
        conversations: []
    };


    let toText = document.getElementById('toText');

    toText.addEventListener('click', e => {
        e.preventDefault();
    
        transition_el_2.classList.add('is-active');
    
        setTimeout(() => {
            window.location.href = `chatpage.html?id=${botId}`;
        }, 500);
    })

     // If there are messages, remove the animation class from the elements
     if (chatData[botId].conversations.length == 0) {
        document.querySelector('.background img').classList.add('background-img-intro');
        document.querySelector('.bf-img').classList.add('bf-img-intro');
        document.querySelector('.bf-img img').classList.add('bf-img-img-intro');
        document.querySelector('.input-container').classList.add('input-container-intro');
        document.querySelector('.chat-container').classList.add('chat-container-intro');
        document.querySelector('.input-recorder').classList.add('input-recorder-intro');
        document.querySelector('button').classList.add('button-intro');
        document.querySelector('.intro').classList.add('do-intro');
        document.querySelector('.intro-text span').classList.add('do-intro-text');
    }

    // Function to add a new message to conversation history of a specific bot and save to localStorage
    const addToConversation = (botId, message, role) => {
        if (!chatData[botId]) return; // Bot not found
        chatData[botId].conversations.push({ message, role});
        // Limit conversation history to a maximum number of messages, if desired
        const MAX_HISTORY_SIZE = 100;
        if (chatData[botId].conversations.length > MAX_HISTORY_SIZE) {
            chatData[botId].conversations.shift(); // Remove oldest message
        }
        saveChatData(chatData);
    }
});