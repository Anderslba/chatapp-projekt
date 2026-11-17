const lastSeen = new Map();

function markActive(userId) {
    lastSeen.set(userId, Date.now());
}

function markInactive(userId) {
    lastSeen.delete(userId);
}

function isActive(userId) {
    const time = lastSeen.get(userId);
    return time !== undefined && Date.now() - time < 5 * 60 * 1000;
}

export { markActive, markInactive, isActive };