var sum_to_n_a = function (n) {
    let result = 0;
    for (var i = 0; i < n; i++) {
        result += i + 1;
    }
    return result;
};

var sum_to_n_b = function (n) {
    return Array.from({length: n}, (_, k) => k + 1).reduce((a, b) => a + b);
};


function* generator(n) {
    let i = 0;
    while (i < n) {
        yield ++i;
    }
}

var sum_to_n_c = function (n) {
    // your code here
    let result = 0;
    for (let i of generator(n)) {
        result += i;
    }
    return result;
};
