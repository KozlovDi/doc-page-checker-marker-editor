window.$ = window.jQuery = require('jquery');

let start, end;

const ul = document.getElementById("marker-list");
const menu = document.getElementById("marker-list-container");
const form = document.querySelector('#popup__block');
const popup = document.querySelector('.popup');
const adv = document.getElementById("popup__adv");

let markerName;
let isIgnore;
let currentPage;

let localStorage = window.localStorage;
localStorage.clear();

let markersList = [];

$(document).ready(function() {
    $("#canvas_container").on('mousedown', function (e) {
        start = {x: e.pageX, y: e.pageY};

        $("#canvas_container").on('mouseup', function (e) {

            end = {x: e.pageX, y: e.pageY};
            if (start.x === end.x && start.y === end.y) {
                return;
            }

            form.classList.add('open');
            popup.classList.add('popup_open');
        });
    });

    document.querySelector('#go_next').addEventListener('click', () =>{
        currentPage = document.getElementById("current_page").value;
        let pageNum = Number(currentPage);
        let JSONMarkersList = JSON.parse(localStorage.getItem(String(pageNum + 1)));
        if (JSONMarkersList != null) {
            markersList = [];
            JSONMarkersList.forEach((marker) => {
                markersList.push(JSON.stringify({
                    name: marker.name,
                    ignore: marker.ignore,
                    x: marker.x,
                    y: marker.y,
                    width: marker.width,
                    height: marker.height
                }));
                document.getElementsByName("marker" + marker.name)[0]
                    .removeAttribute("hidden");
            });
        }
        else
            markersList = [];
        console.log(markersList);
        let prevJSONMarkersList = JSON.parse(localStorage.getItem(String(pageNum)));
        if (prevJSONMarkersList != null) {
            prevJSONMarkersList.forEach((marker) => {
                document.getElementsByName("marker" + marker.name)[0]
                    .setAttribute('hidden', 'true');
            });
        }
    });

    document.querySelector('#go_previous').addEventListener('click', () =>{
        currentPage = document.getElementById("current_page").value;
        let pageNum = Number(currentPage);
        let JSONMarkersList = JSON.parse(localStorage.getItem(String(pageNum - 1)));
        if (JSONMarkersList != null) {
            markersList = [];
            JSONMarkersList.forEach((marker) => {
                markersList.push(JSON.stringify({
                    name: marker.name,
                    ignore: marker.ignore,
                    x: marker.x,
                    y: marker.y,
                    width: marker.width,
                    height: marker.height
                }));
                document.getElementsByName("marker" + marker.name)[0]
                    .removeAttribute("hidden");
            });
        }
        else
            markersList = [];
        console.log(markersList);
        let prevJSONMarkersList = JSON.parse(localStorage.getItem(String(pageNum)));
        if (prevJSONMarkersList != null) {
            prevJSONMarkersList.forEach((marker) => {
                document.getElementsByName("marker" + marker.name)[0]
                    .setAttribute('hidden', 'true');
            });
        }
    });
    createMarker();
});

function checkNameUniqueness(markerName) {
    let names = document.body.querySelectorAll('.marker-name');
    let isUniq = true;
    names.forEach((item) => {
        if(markerName === item.innerHTML || item.innerHTML === ''){
            isUniq = false;
            return;
        }
    });
    return isUniq;
}

function  createMarker() {

    document.querySelector('.btn-success').addEventListener('click', () => {
        const markerNameSpanElem = document.createElement("span");
        const markerDivElem = document.createElement("div");
        const isIgnoreBtn = document.createElement("input");
        const isIgnoreLabel = document.createElement("label");
        const delBtn = document.createElement("button");
        const li = document.createElement("li");

        markerName = document.getElementById('enter__name').value;
        isIgnore = document.getElementById('is-ignore').value;

        if(!checkNameUniqueness(markerName)){
            adv.removeAttribute("hidden");
            return;
        }

        form.classList.remove('open');
        popup.classList.remove('popup_open');

        markersList.push(JSON.stringify({
            name: markerName,
            ignore: false,
            x: Math.min(start.x, end.x),
            y: Math.min(start.y, end.y),
            width: Math.abs(end.x - start.x),
            height: Math.abs(end.y - start.y)
        }));

        localStorage.setItem(document.getElementById("current_page").value, "[" + markersList + "]");

        markerNameSpanElem.setAttribute("id", "marker-name");
        markerNameSpanElem.setAttribute("name", "marker-name" + markerName);
        markerNameSpanElem.setAttribute("class", "marker-name");
        markerNameSpanElem.innerHTML = markerName;

        markerDivElem.setAttribute("id", "marker");
        markerDivElem.setAttribute("name", "marker" + markerName);
        markerDivElem.style.left = Math.min(start.x, end.x) + 'px';
        markerDivElem.style.top = Math.min(start.y, end.y) + 'px';
        markerDivElem.style.width = Math.abs(end.x - start.x) + 'px';
        markerDivElem.style.height = Math.abs(end.y - start.y) + 'px';
        markerDivElem.appendChild(markerNameSpanElem);

        document.body.appendChild(markerDivElem);

        isIgnoreBtn.setAttribute("type", "checkbox");
        isIgnoreBtn.setAttribute("id", "is-ignore");
        isIgnoreBtn.setAttribute("name", "is-ignore" + markerName);

        isIgnoreLabel.setAttribute("for", "isIgnoreBtn");
        isIgnoreLabel.innerHTML = "isIgnoreBtn";
        isIgnoreLabel.style.margin = "0px 0px 0px 10px";

        delBtn.setAttribute("id", "del-btn");
        delBtn.setAttribute("name", "del" + markerName);
        delBtn.setAttribute("onClick", `
            currentPage = document.getElementById("current_page").value;
            let tempMarkerList = JSON.parse(localStorage.getItem(currentPage));
            
            jQuery(tempMarkerList).each(function (i){
                if(tempMarkerList[i].name === \'` + markerName + `\'){
                    tempMarkerList.splice(i, 1);
                    return;
                }
            });
            localStorage.setItem(currentPage, JSON.stringify(tempMarkerList));
        `);
        delBtn.innerHTML = "x";

        li.setAttribute("id", "li");
        li.setAttribute("name", "li" + markerName);
        li.innerHTML = markerName;
        li.appendChild(isIgnoreLabel);
        li.appendChild(isIgnoreBtn);
        li.appendChild(delBtn);

        ul.appendChild(li);

        menu.appendChild(ul);

        document.getElementById('enter__name').value = "";

        adv.setAttribute("hidden", "true");

    });

    document.querySelector('.btn-cancel').addEventListener('click', () => {
        form.classList.remove('open');
        popup.classList.remove('popup_open');
    });

}
