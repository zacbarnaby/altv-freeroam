let chatOpened = false;
let messageBuffer = [];
let currentBufferIndex = -1;
let timeout = null;
let messagesBlock = null;
let msgListBlock = null;
let msgInputBlock =  null;
let msgInputLine = null;

if('alt' in window) {
    alt.on('addString', (text) => addString(colorify(text)));
    alt.on('addMessage', (name: string, text: string) => addString(`${name}: ${colorify(text)}`));
    alt.on('openChat', openChat);
    alt.on('closeChat', closeChat);
}

function checkOverflow() {
    if(messagesBlock.clientHeight > msgListBlock.clientHeight) {
        if(!msgListBlock.classList.contains('overflowed')) {
            msgListBlock.classList.add('overflowed');
        }
    } else if(msgListBlock.classList.contains('overflowed')) {
        msgListBlock.classList.remove('overflowed');
    }
}

function openChat(insertSlash) {

    clearTimeout(timeout);
    if(chatOpened) return;

    if(insertSlash) {
        msgInputLine.value = '/';
    }

    messagesBlock.classList.remove('closed');
    msgListBlock.classList.add('opened');
    messagesBlock.classList.add('glow');

    msgInputBlock.style.display = 'block';
    msgInputBlock.style.opacity = 1;
    msgInputLine.focus();

    chatOpened = true;

}

function closeChat() {
    if(!chatOpened) return;

    msgListBlock.classList.remove('opened');
    messagesBlock.classList.remove('glow');
    messagesBlock.classList.add('closed');

    msgInputLine.blur();
    msgInputBlock.style.display = 'none';
    chatOpened = false;
}

window.addEventListener('load', () => {
    messagesBlock = document.querySelector('.messages');
    msgListBlock = document.querySelector('.msglist');
	msgInputBlock = document.querySelector('.msginput');
	msgInputLine = document.querySelector('.msginput input');

    // Send message to client on enter pressed
    document.querySelector('#message').addEventListener('submit', e => {
        e.preventDefault();
        
        alt.emit('chatMessage', msgInputLine.value);
        saveBuffer();
        closeChat();

        msgInputLine.value = '';
    });

    // Determine what happens on key pressed
    msgInputLine.addEventListener('keydown', e => {
        // If tab is pressed
        if(e.keycode === 9) e.preventDefault();
        // If down arrow is pressed
        else if(e.keycode == 40) {
            e.preventDefault();
            if(currentBufferIndex > 0) {
                loadBuffer(--currentBufferIndex);
            } else if(currentBufferIndex == 0) {
                currentBufferIndex = -1;
                msgInputLine.value = '';
            }
        }
        // If up arrow is pressed
        else if(e.keyCode == 38) {
            e.preventDefault();
            if(currentBufferIndex < (messageBuffer.length - 1)) {
                loadBuffer(++currentBufferIndex);
            }
        }
    });

    alt.emit('chatLoaded');
});

function saveBuffer() {
    if(messageBuffer.length > 100) messageBuffer.pop();
    
    messageBuffer.unshift(msgInputLine.value);
    currentBufferIndex = -1;
}

function loadBuffer(idx: number) {
    msgInputLine.value = messageBuffer[idx];
}

function highlightChat() {

    msgListBlock.scrollTo({
        left: 0,
        top: msgListBlock.scrollHeight,
        behaviour: 'smooth'
    });

    if(chatOpened) return;

    messagesBlock.classList.add('glow');
    clearTimeout(timeout);

    timeout = setTimeout(() => {
        messagesBlock.classList.remove('glow');
    }, 3000);

    console.log('New message');
}

function addString(text: string) {
    if(messagesBlock.children.length > 100) messagesBlock.removeChild(messagesBlock.children[0]);
    const message = document.createElement('p');
    message.innerHTML = text;
    messagesBlock.appendChild(message);
    checkOverflow();
    highlightChat();
}

function colorify(text: string): string {
    let matches = [];
    let m = null;
    let curPos = 0;

    if (!text) {
        return '';
    }

    do {
        m = /\{[A-Fa-f0-9]{3}\}|\{[A-Fa-f0-9]{6}\}/g.exec(text.substr(curPos));

        if (!m) {
            break;
        }

        matches.push({
            found: m[0],
            index: m['index'] + curPos
        });

        curPos = curPos + m['index'] + m[0].length;
    } while (m != null);

    if (matches.length > 0) {
        text += '</font>';

        for (let i = matches.length - 1; i >= 0; --i) {
            let color = matches[i].found.substring(1, matches[i].found.length - 1);
            let insertHtml = (i != 0 ? '</font>' : '') + `<font style="text-shadow: 1px 1px 5px #${color};" color="#${color}">`;
            text = text.slice(0, matches[i].index) + insertHtml + text.slice(matches[i].index + matches[i].found.length, text.length);
        }
    }

    return text;
}