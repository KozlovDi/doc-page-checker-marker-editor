window.$ = window.jQuery = require('jquery');
const fs = require('fs');

let pages = [];

$(document).ready(function(){
    document.querySelector('.btn-save').addEventListener('click', () => {
        let keys = Object.keys(localStorage).sort(function (a, b) {
            return a - b;
        });
        keys.forEach((key) =>{
            pages.push({elements : {markers : JSON.parse(localStorage.getItem(key))}})
        })

        console.log(localStorage);

        fs.writeFile("./resources/markers.json", JSON.stringify({pages : pages}).replaceAll("\\", "").replaceAll(/"(?={|})/g , ''), function(err) {
            if (err) {
                console.log(err);
            }
        });
    });
});

