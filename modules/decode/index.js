const decodeCharRefs = (value) => {
    console.log(value);
    return value
        .replace(/&#(\d+);/g, function(match, num) {
            return String.fromCharCode(num);
        })
        .replace(/&#x([A-Za-z0-9]+);/g, function(match, num) {
            return String.fromCharCode(parseInt(num, 16));
        });
}

module.exports = (value) => {
    console.log('decode');
    return decodeCharRefs(value);
};