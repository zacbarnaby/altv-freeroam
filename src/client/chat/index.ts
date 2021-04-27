import * as alt from 'alt-client';

let messageBuffer = [];
let chatLoaded = false;
let chatOpened = false;

const view = new alt.WebView("http://resource/client/chat/html/index.html");

const addMessage = (name: string, text: string) => {
    // If message from a player append with name name
    if(name) view.emit('addMessage', name, text);
    // If no name, append as server message
    else view.emit('addString', text);
}

view.on('chatLoaded', () => {
    for(const msg of messageBuffer) {
        addMessage(msg.name, msg.text);
    }
    chatLoaded = true;
    alt.emitServer('playerReady');
    alt.log('view: chatLoaded');
});

view.on('chatMessage', (text: string) => {
    // Send string from webview to server
    alt.emitServer('chat:handleMessage', text);
    // Close chat and enable game controls
    chatOpened = false;
    alt.toggleGameControls(true);
});

alt.onServer('chat:sendMessage', pushMessage);

// Old style function due to above line moaning
export function pushMessage(name: string, text: string) {
    alt.log(name, text);
    // Check if chat is loaded, if not add message to buffer
    if(!chatLoaded) messageBuffer.push({ name, text });
    // If chat is loaded, send message to webview
    else addMessage(name, text);
}

alt.on('keyup', (key: number) => {

    if(!chatLoaded) return;

    // If chat is closed and pressed T
    if(!chatOpened && key === 0x54 && alt.gameControlsEnabled()) {
        chatOpened = true;
        view.emit('openChat', false);
        alt.toggleGameControls(false);
        alt.log('key t')
    } 
    // If chat is closed and pressed /
    else if(!chatOpened && key === 0xBF && alt.gameControlsEnabled()) {
        chatOpened = true;
        view.emit('openChat', true);
        alt.toggleGameControls(false);
    }
    // If chat is opened and pressed escape
    else if(chatOpened && key == 0x1B) {
        chatOpened = false;
        view.emit('closeChat');
        alt.toggleGameControls(true);
    }

});