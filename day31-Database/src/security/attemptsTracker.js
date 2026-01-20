

const MAX_ATTEMPTS = 5;
const BLOCK_TIME_MS = 15 * 60 * 1000; 

const attempts = {} 

const recordFailure = (email) => {

    if(!attempts[email]){
        attempts[email] = {
            "count" : 1,
            "blockedUntil" : 0, 
        }
        return;
    }

    attempts[email].count += 1;

    if(attempts[email].count === MAX_ATTEMPTS){
        attempts[email].blockedUntil = Date.now() + BLOCK_TIME_MS;
    }

}

const isBlocked = (email) => {
    const entry = attempts[email];
    if(!entry || !entry.blockedUntil){
        return false;
    }

    if(attempts[email].blockedUntil < Date.now()){
        delete attempts[email];
        return false;
    }

    return true;
}

const resetAttempts = (email) => {
    delete attempts[email];
}

export { isBlocked, recordFailure, resetAttempts };