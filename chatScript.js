const chatbox = document.querySelector(".chat-container .chatbox");
const chatcontainer = document.querySelector(".chat-container");
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




    // Assuming chatbox is the element where you want to append the messages
    const chatbox = document.getElementById("chatbox");

    const createChatLi = (message, className) => {
        // Create a chat <li> element with passed message and className
        const chatLi = document.createElement("li");
        chatLi.classList.add("chat", `${className}`);
        let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined"></span><p></p>`;
        chatLi.innerHTML = chatContent;
        chatLi.querySelector("p").textContent = message;
        return chatLi; // return chat <li> element
    }

    // Iterate over each conversation message and append it to the chatbox
    if (chatDataForBot && chatDataForBot.conversations) {
        chatDataForBot.conversations.forEach(conversation => {
            const { message, role } = conversation;
            const className = role === "assistant" ? "incoming" : "outgoing";
            console.log(className);
            const chatMessageLi = createChatLi(message, className);
            chatbox.appendChild(chatMessageLi);
            chatcontainer.scrollTo(0, chatcontainer.scrollHeight);
        });
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
        chatcontainer.scrollTo(0, chatcontainer.scrollHeight);
    }
    

    // Now conversationMemory contains the last 5 messages from the user and bot
    console.log(conversationMemory);


    let userMessage = null; // Variable to store user's message
    const API_KEY = "WOMP WOMP THE API KEY DOESNT SEEM TO BE HERE. I WONDER WHERE IT COULD BE.";
    const inputInitHeight = chatInput.scrollHeight;

     // Replace the GPT-4 API URL with the actual API Gateway URL
const API_GATEWAY_URL = 'https://znx1pasuye.execute-api.us-west-2.amazonaws.com/dev/chat';

// Function to generate a response using the GPT-4 API through API Gateway
const generateResponse = (userMessage) => {
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

    fetch(API_GATEWAY_URL, requestOptions)
        .then(res => res.json())
        .then(data => {
            const botResponse = data.choices[0].message.content.trim();
            addToConversation(botId, botResponse, 'assistant');

            conversationMemory.push(userMessage, botResponse);

            if (conversationMemory.length > 2 * MAX_MEMORY_SIZE) {
                conversationMemory.splice(0, conversationMemory.length - 2 * MAX_MEMORY_SIZE);
            }

            chatbox.innerHTML = ''; // Clear existing messages in the chat container

            // Create a <p> element to hold the incoming message
            const chatLi = document.createElement('li');
            chatLi.classList.add('chat', 'incoming');
            const chatParagraph = document.createElement('p');
            chatLi.appendChild(chatParagraph);
            chatbox.appendChild(chatLi);

            const characters = botResponse.split(''); // Split the message into individual characters
            let i = 0;

            const textSpeed = () => {
                if (i < characters.length) {
                    chatParagraph.textContent += characters[i];
                    chatbox.scrollTo(0, chatbox.scrollHeight);
                    i++;
                    setTimeout(textSpeed, 10); // Adjust the delay between characters (in milliseconds)
                }
            };

            textSpeed(); // Start the typewriter effect
        })
        .catch(() => {
            const errorMessage = '[Connection Issue] Womp Womp... Your boyfriend is having problems :(';
            const chatLi = createChatLi(errorMessage, 'error');
            chatbox.appendChild(chatLi);
            chatbox.scrollTo(0, chatbox.scrollHeight);
        }).finally(() => chatcontainer.scrollTo(0, chatcontainer.scrollHeight));
};

// Assuming `addToConversation`, `handleChat`, and other parts are implemented elsewhere
// and that they follow after this function.





    const handleChat = () => {
        userMessage = chatInput.value.trim(); // Get user entered message and remove extra whitespace
        if (!userMessage) return;

        // Clear the input textarea and set its height to default
        chatInput.value = "";
        chatInput.style.height = `${inputInitHeight}px`;

        addToConversation(botId, userMessage, "user");
        // Generate response and append it to the chatbox
        const chatMessageLiUser = createChatLi(userMessage, "outgoing");
        chatbox.appendChild(chatMessageLiUser);

        chatcontainer.scrollTo(0, chatcontainer.scrollHeight);
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

    let toDate = document.getElementById('toDate');

    toDate.addEventListener('click', e => {
        e.preventDefault();
    
        transition_el_2.classList.add('is-active');
    
        setTimeout(() => {
            window.location.href = `datingsim.html?id=${botId}`;
        }, 500);
    })
});




















/*
---------------------------------------------------------------------------------------------------------------
CHAT DATA MANAGER
---------------------------------------------------------------------------------------------------------------
*/


/* const saveChatData = (data) => {
    localStorage.setItem("chatData", JSON.stringify(data));
} */

const saveChatData = (data) => {
    localStorage.setItem("chatData", JSON.stringify(data));
    console.log(localStorage.getItem("chatData"));
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