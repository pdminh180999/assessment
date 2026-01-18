export const generateCover = () => {
    const randColor = () =>
        `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0")}`;

    const angle = Math.floor(Math.random() * 360);
    const c1 = randColor();
    const c2 = randColor();

    return `linear-gradient(${angle}deg, ${c1}, ${c2})`;
};

export const generateId = () => {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const isValidUrl = (string) => {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
};
