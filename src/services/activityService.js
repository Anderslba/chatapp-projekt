const lastActive = new Map();

function markActive(userId) {
    lastActive.set(userId, Date.now());
}

function markInactive(userId) {
    lastActive.delete(userId);
}

function isActive(userId) {
    const time = lastActive.get(userId);
    // hvis 
    return time !== undefined && Date.now() - time < 5 * 60 * 1000;
}

export { markActive, markInactive, isActive };