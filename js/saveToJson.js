window.$ = window.jQuery = require('jquery');
const fs = require('fs');

let pages = [];

$(document).ready(function () {
    document.querySelector('.btn-save').addEventListener('click', () => {
        let keys = Object.keys(localStorage).sort(function (a, b) {
            return a - b;
        });
        let maxKey = keys[keys.length - 1];
        for (let i = 1; i <= maxKey; i++) {
            if (keys.includes(i.toString()))
                continue;
            keys.splice(i, 0, i.toString());
        }
        keys = keys.sort(function (a, b) {
            return a - b;
        });
        keys.forEach((key) => {
            localStorage.getItem(key) === null ?
                pages.push({}) :
                pages.push({elements: {markers: JSON.parse(localStorage.getItem(key))}})
        })

        fs.writeFile("./resources/markers.json", JSON.stringify({pages: pages}).replaceAll("\\", "").replaceAll(/"(?={|})/g, ''), function (err) {
            if (err) {
                console.log(err);
            }
        });
        pages = [];
    });
});

