

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

function pickCSS() {
    var pickLang = localStorage.getItem("langID");
    if (typeof pickLang !== 'undefined' && pickLang !== null) {
        if (pickLang.localeCompare("he") === 0) {
            pickLang = "en";
            swapStyleSheet('css/styles.css');
          
            localStorage.setItem("langID", "he");
            loadLang();
        } else if (pickLang.localeCompare("en") === 0) {
            pickLang = "he";
            localStorage.setItem("langID", "en");
          
            swapStyleSheet('css/styles-eng.css');
            loadLang();
        }
    } else {
        pickLang = "he";
        localStorage.setItem("langID", "he");
        swapStyleSheet('css/styles.css');
        loadLang();
    }
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
                    localStorage.setItem("langID", "he");
                    $('#lang').css("background-image", "url('../cut/Group 128.png')");
                    localStorage.setItem("lang", JSON.stringify(myObj.HE));
                } else {
                    localStorage.setItem("langID", "en");
                    $('#lang').css("background-image", "url('../cut/Group 128 - eng.png')");
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

//Json methods
function getToken() {
    var d = $.Deferred();
    $.post("https://headless-cms.bh.org.il/beit-hatfutsot/auth/authenticate",
        { email: "rfid-app@bh.org.il", password: "sMM8V69JmQw!9!1" },
        function (data, status) {
            console.log(data.data.token);
            d.resolve(data.data.token);
        }
    );
    return d.promise();
}

async function getPersonalities() {
    var d = $.Deferred();
    var token = await getToken();
    var url = "https://headless-cms.bh.org.il/beit-hatfutsot/items/rfid_personalities?fields=*,translations.*&access_token=" + token;
    $.ajax({
        url: url,
        type: "GET",
        crossDomain: true,
        async: true,
        success: function (result) {
            console.log(result);
            d.resolve(result);
        },
        error: function (jqXHR, status) {
            console.log(status);
        }
    });
    return d.promise();
}

function changeIcons(num) {
    if (num === 0) {
        $('#edu').css("background-image", "url('../cut/Group 232.png')");
        $('#career').css("background-image", "url('../cut/Group 233.png')");
        $('#politics').css("background-image", "url('../cut/Group 234.png')");
    } else {
        $('#edu').css("background-image", "url('../cut/Group 232 - eng.png')");
        $('#career').css("background-image", "url('../cut/Group 233 - eng.png')");
        $('#politics').css("background-image", "url('../cut/Group 234 - eng.png')");
    }
}

async function getCountries() {
    var d = $.Deferred();
    var token = await getToken();
    var url = "https://headless-cms.bh.org.il/beit-hatfutsot/items/rfid_countries?fields=*,translations.*,translations.timeline.*&access_token=" + token;
    $.ajax({
        url: url,
        type: "GET",
        crossDomain: true,
        async: true,
        success: function (result) {
            console.log(result);
            d.resolve(result);
        },
        error: function (jqXHR, status) {
            console.log(status);
        }
    });
    return d.promise();
}


async function getCategory(category) {
    var json = await getPersonalities();
    var filtered = $(json.data).filter(function (i, n) {
        var bool = false;
        for (j = 0; j < n.translations.length; j++) {
            if (n.translations[j].category === category) {
                bool = true;
            }
        }
        return bool;
    });
    return filtered;
}

async function getSubCategory(sub_category) {
    var json = await getPersonalities();
    var filtered = $(json.data).filter(function (i, n) {
        var bool = false;
        for (j = 0; j < n.translations.length; j++) {
            if (n.translations[j].sub_category === sub_category) {
                bool = true;
            }
        }
        return bool;
    });
    return filtered;
}

