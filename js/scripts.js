function goHomePg() {
    location.href = 'page14.html';
}

function mail() {
    window.location = "mailto:";
}

function swapStyleSheet(sheet) {
    document.getElementById("pagestyle").setAttribute("href", sheet);
}

function getLangJSON(lang) {
    $.getJSON('js/lang.json', function (response) {
        localStorage.clear();
        localStorage.setItem("jsonLang", JSON.stringify(response));
        JsonLang = localStorage.getItem("jsonLang");
        console.log(JsonLang);
    });
}


function loadLang() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            var myObj = JSON.parse(this.responseText);
            var pickLang = localStorage.getItem("langID");
            console.log(myObj);
            if (typeof pickLang !== 'undefined' && pickLang !== null) {
                if (pickLang.localeCompare("he") === 0) {
                    console.log("to hebrew");
                    localStorage.setItem("langID", "he");
                    localStorage.setItem("lang", JSON.stringify(myObj.HE));
                } else {
                    console.log("to english");
                    localStorage.setItem("langID", "en");
                    localStorage.setItem("lang", JSON.stringify(myObj.EN));
                }
            } else {
                localStorage.setItem("langID", "he");
                localStorage.setItem("lang", JSON.stringify(myObj.HE));
            }
        }
    };
    xmlhttp.open("GET", "js/lang.json", true);
    xmlhttp.send();

}