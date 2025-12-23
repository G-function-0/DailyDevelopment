const session = {};


function generateSession(userId){
    const sessionId  = Math.random().toString(36).slice(2);
    session[sessionId] = {userId}; 
    return sessionId;
}

function getSession(sessionId){
    return session[sessionId];
}

module.exports = { generateSession , getSession};