var token; 

function goHomePg() {
    location.href = 'https://rfid.anumuseum.org.il/?rfid=10007605ED';
}

function mail(langIs, url) {
    var subjectIs = '';
    var bodyIs = url;
    if (langIs.localeCompare("eng") === 0) {
        subjectIs = 'Anu - Museum of the jewish people';
        window.location = "mailto:?subject=" + subjectIs+ "&body="+ bodyIs;
    } else if (langIs.localeCompare("heb") === 0) {
        subjectIs = 'אנו – מוזיאון העם היהודי';
        window.location = "mailto:?subject=" + subjectIs + "&body=" + bodyIs;
    }
}

function swapStyleSheet(sheet) {
    document.getElementById("pagestyle").setAttribute("href", sheet);
}

function getOccupationByValue(occup) {
    var catIs = "";
    if (occup.localeCompare('Education') === 0) {
        catIs = 'edu';
    } else if (occup.localeCompare('Work') === 0) {
        catIs = 'work';
    } else if (occup.localeCompare('Politic') === 0) {
        catIs = 'politic';
    }
    return catIs;
}

async function getOccupationById(numStr) {
    var json = await getTrailWomen();
    var cat = "";
    var filtered = $(json).filter(function (i, n) {
        var bool = false;
        if (n.ext_id.localeCompare(numStr) === 0) {
            cat = n.translations[0].occupation;
            console.log(cat);
            bool = true;
        }
        return bool;
    });
    return getOccupationByValue(cat);
}

function parseId(idString) {
    var num = '';
    var z = 0;
    for (i = 0; i < idString.length; i++) {
        if ("" + parseInt(idString[i]) !== "NaN")
            num = num + idString[i];
    }
    z = parseInt(num);
    return z;
}

function getLangJSON(lang) {
    $.getJSON('js/lang.json', function (response) {
        localStorage.clear();
        localStorage.setItem("jsonLang", JSON.stringify(response));
        JsonLang = localStorage.getItem("jsonLang");
        console.log(JsonLang);
    });
}

function getLang() {
    var langIs = localStorage.getItem('langID');
    if (langIs.localeCompare("eng") === 0) {
        return "en";
    } else {
        return "he";
    }
}

function loadCSSLang(lang) {
    if (lang.localeCompare("heb") === 0) {
        swapStyleSheet('css/styles.css');
        localStorage.setItem("langID", "heb");
        loadLang();
    } else if (lang.localeCompare("eng") === 0) {
        localStorage.setItem("langID", "eng");
        swapStyleSheet('css/styles-eng.css');
        loadLang();
    }
}

function pickCSS() {
    var pickLang = getParameterByName("lang");
    if (pickLang) {
        loadCSSLang(pickLang);
    } else {
        localStorage.setItem("langID", "heb");
        loadCSSLang("heb");
    }
}

//function pickCSS() {
//   // var pickLang = localStorage.getItem("langID");
//    var pickLang = getParameterByName("lang");
//    if (typeof pickLang !== 'undefined' && pickLang !== null) {
//        if (pickLang.localeCompare("he") === 0) {
//            console.log("pick lang is :     "+pickLang);
//            swapStyleSheet('css/styles.css');
//            localStorage.setItem("langID", "he");
//            loadLang();
//        } else if (pickLang.localeCompare("en") === 0) {
//            localStorage.setItem("langID", "en");
//            swapStyleSheet('css/styles-eng.css');
//            loadLang();
//        }
//    } else {
//        localStorage.setItem("langID", "he");
//        swapStyleSheet('css/styles.css');
//        loadLang();
//    }
//}

function pickLanguage() {
    var pickLang = localStorage.getItem("langID");
    if (typeof pickLang !== 'undefined' && pickLang !== null) {
        if (pickLang.localeCompare("heb") === 0) {
            localStorage.setItem("langID", "eng");
            pickCSS();
        } else if (pickLang.localeCompare("eng") === 0) {
            localStorage.setItem("langID", "heb");
            pickCSS();
        }
    } else {
        localStorage.setItem("langID", "heb");
        pickCSS();
    }
}

function clearTxts(txtWrap) {
    $("." + txtWrap).find("*").addBack().contents().filter(function () {
        return this.nodeType === 3;
    }).remove();
}

function loadLang() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            var myObj = JSON.parse(this.responseText);
            var pickLang = localStorage.getItem("langID");
            if (typeof pickLang !== 'undefined' && pickLang !== null) {
                if (pickLang.localeCompare("heb") === 0) {
                    localStorage.setItem("langID", "heb");
                    $('#lang').css("background-image", "url('cut/Group 128.png')");
                    localStorage.setItem("lang", JSON.stringify(myObj.HE));
                } else {
                    localStorage.setItem("langID", "eng");
                    $('#lang').css("background-image", "url('cut/Group 312.png')");
                    localStorage.setItem("lang", JSON.stringify(myObj.EN));
                }
            } else {
                localStorage.setItem("langID", "heb");
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
            headers = { 'Authorization': data.data.token };       
            d.resolve(data.data.token);
        }
    );
    return d.promise();
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    var temp = '10007605ED';   // temp var -> to be removed after integration 
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return temp;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}


async function getImgVideoId(id,videoImg,starCountry) {
    var langIs = getLang();
    var json = "";
    if (starCountry.localeCompare('country') === 0) {
        var jsonIs = await getCountries();
        json = jsonIs.data;
    } else if (starCountry.localeCompare('star') === 0) {
        json = await getStars();
    }
    var idIs = 0;
    var filtered = $(json).filter(function (i, n) {
        var bool = false;
        for (j = 0; j < n.translations.length; j++) {
            if (n.ext_id.localeCompare(id) === 0) {
                if (videoImg === 0) {
                    if (n.image) {                 
                        bool = true;
                        idIs = n.image.id;
                    }
                } else if (videoImg === 1) {
                    if (n.translations[j].language === langIs && n.translations[j].video) {
                        bool = true;
                        idIs = n.translations[j].video;
                    }
                }
            }
        }
        return bool;
    });
    return idIs;
}

async function getImgDetails(id,starCountry) {
    var d = $.Deferred();
    var token = await getToken();
    var imgId = await getImgVideoId(id,0,starCountry);
    var url = "https://headless-cms.bh.org.il/beit-hatfutsot/files/" + imgId + "";
    $.ajax({
        url: url,
        type: "GET",
        crossDomain: true,
        async: true,
        data: {'access_token':token},
        success: function (result) {
            d.resolve(result);
        },

        error: function (jqXHR, status) {
            console.log(status);
        }
    });
    return d.promise();
}

async function getVideoDetails(id, starCountry) {
    var d = $.Deferred();
    var token = await getToken();
    var videoId = await getImgVideoId(id, 1, starCountry);
    var url = "https://headless-cms.bh.org.il/beit-hatfutsot/files/" + videoId + "";
    $.ajax({
        url: url,
        type: "GET",
        crossDomain: true,
        async: true,
        data: { 'access_token': token },
        success: function (result) {          
            d.resolve(result);
        },
        error: function (jqXHR, status) {
            console.log(status);
        }
    });
    return d.promise();
}



async function getPersonalities() {
    var d = $.Deferred();
    var token = await getToken();
    var tokenTitle = 'access_token';
    var url = "https://headless-cms.bh.org.il/beit-hatfutsot/items/rfid_personalities?fields=*,translations.*&access_token=" + token + "&limit=-1";
    $.ajax({
        url: url,
        type: "GET",
        crossDomain: true,
        async: true,
        success: function (result) {
            d.resolve(result);
           // location.href = "https://headless-cms.bh.org.il/beit-hatfutsot/items/80_1";
            //location.href = "https://headless-cms.bh.org.il/beit-hatfutsot/files/3078&access_token=" + token +"";
        },
        error: function (jqXHR, status) {
            console.log(status);
        }
    });
    return d.promise();
}

function changeIcons(num) {
    if (num === 0) {
        $('#edu').css("background-image", "url('cut/Group 232.png')");
        $('#work').css("background-image", "url('cut/Group 233.png')");
        $('#politic').css("background-image", "url('cut/Group 234.png')");
    } else {
        $('#edu').css("background-image", "url('cut/Group 311.png')");
        $('#work').css("background-image", "url('cut/Group 310.png')");
        $('#politic').css("background-image", "url('cut/Group 309.png')");
    }
}


async function getCatById(num) {         //return catg name&key
    var numInt = parseInt(num, 10);
    var json = await getJewishStars();
    var cat = "";
    var filtered = $(json).filter(function (i, n) {
        var bool = false;
        if (n.ext_id.localeCompare(num) === 0) {
            cat = n.translations[0].category;
            bool = true;
        }
        return bool;
    });
    return getCategoryKey(cat);
}
async function getSubCatById(num) {      //retutn subcat name
    var numInt = parseInt(num, 10);
    var json = await getJewishStars();
    var subCat = "";
    var filtered = $(json).filter(function (i, n) {
        var bool = false;
        if (n.ext_id.localeCompare(num) === 0) {
            subCat = n.translations[0].sub_category;
            bool = true;
        }
        return bool;
    });
    return subCat;
}

function getSubCatKey(subcat, cat, json) {   //return sub cat key
    jsonIs = json.filterCatg[cat];
    return getKeyByValue(jsonIs["subCat"], subcat);
}



function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

function getCategoryKey(catIs){
    var catName = ['ArtistsAndCreators', 'Athletes', 'EconomistsAndBusinessEntrepreneurs', 'HolocaustHeroes', 'JournalistsAndMediaPersonalities', 'ScientistsAndPhilosophers', 'Politicians', 'MilitaryLeaders','Others'];
    var catNum = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9'];
    var numIs = catName.indexOf(catIs);
    return catNum[numIs];
}


async function getCountries() {
    var d = $.Deferred();
    var token = await getToken();
    var url = "https://headless-cms.bh.org.il/beit-hatfutsot/items/rfid_countries?fields=*,translations.*,translations.timeline.*&access_token=" + token + "&limit=-1";
    $.ajax({
        url: url,
        type: "GET",
        crossDomain: true,
        async: true,
        success: function (result) {
         
            console.log(result);
            window.localStorage.setItem('access_token', token);
            var tokenTitle = 'access_token';        
            document.cookie = tokenTitle + "=" + token;
            let headers = {};
            if (token) {
                headers = { 'Authorization': token };
            }
            d.resolve(result);
        },
        error: function (jqXHR, status) {
            console.log(status);
        }
    });
    return d.promise();
}

async function getCategory(category) {
    var json = await getJewishStars();
    var filtered = $(json).filter(function (i, n) {
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
    var json = await getJewishStars();
    var filtered = $(json).filter(function (i, n) {
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

async function getOccupation(occupationIs) {
    json = await getTrailWomen();
    var filtered = $(json).filter(function (i, n) {
        var bool = false;
        for (j = 0; j < n.translations.length; j++) {
            if (n.translations[j].occupation === occupationIs) {
                bool = true;
            }
        }
        return bool;
    });
    return filtered;
}

async function getBirthYear(json, catIs) {
    var filtered = $(json.data).filter(function (i, n) {
        var bool = false;
        var x= Math.floor(Math.random() * 1960); 
        for (j = 0; j < n.translations.length; j++) {
            if (n.birth_year <= x && n.birth_year >1905) {
                bool = true;
            }
        }
        return bool;
    });
    return filtered;
}



async function getJewishStars() {
    var json = await getPersonalities();
    var filtered = $(json.data).filter(function (i, n) {
        var bool = false;
        str = n.ext_id.substring(0, 2);
        if (str.indexOf("30") > -1 || n.id>-1) {
                bool = true;
            }
        
        return bool;
    });
    return filtered;
}


async function getStars() {
    var json = await getPersonalities();
    var filtered = $(json.data).filter(function (i, n) {
        var bool = false;
        str = n.ext_id.substring(0, 2);
        if (str.indexOf("80") > -1) {
                bool = true;
            }
        return bool;
    });
    return filtered;
}

async function getTrailWomen() {
    var json = await getPersonalities();
    var filtered = $(json.data).filter(function (i, n) {
        var bool = false;
        var str = n.ext_id.substring(0, 2);
        if (str.indexOf("29") > -1) {
                bool = true;
            }
        
        return bool;
    });
    return filtered;
}

function countOccurences(str, word) {
    str = str.toLowerCase();
    word = word.toLowerCase();
    return str.split(word).length - 1;
}

async function searchCountry(country) {
    var json = await getCountries();
    var filtered = $(json.data).filter(function (i, n) {
        var bool = false;
        for (j = 0; j < n.translations.length; j++) {
            if (countOccurences(n.translations[j].name, country) > 0) {
                bool = true;
            }
        }
        return bool;
    });
    return filtered;
}

async function searchPerson(person) {
    var json = await getPersonalities();
    var filtered = $(json.data).filter(function (i, n) {
        var bool = false;
        for (j = 0; j < n.translations.length; j++) {
            if (countOccurences(n.translations[j].first_name, person) > 0 || countOccurences(n.translations[j].last_name,person) > 0) {
                bool = true;
            }
        }
        return bool;
    });
    return filtered;

}



function clearTXT(idElem) {
    $("*").each(function (i, e) {
        if (e.nodeType === Node.TEXT_NODE) {
            e.nodeValue='';
        }
    });
}

function addToColumn() {
    var c1 = document.getElementById("col1").childElementCount;
    var c2 = document.getElementById("col2").childElementCount;
    if (c1 > c2) {
        return 'col2';
    } else {
        return 'col1';
    }
}

function addModalbox() {
    currUrl = document.URL;

    var modal = document.getElementById("shareModal");

    var btn = document.getElementById("shareBtn");
    var span = document.getElementsByClassName("close")[0];
    btn.onclick = function () {
        modal.style.display = "block";
    };

    span.onclick = function () {
        modal.style.display = "none";
    };


    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };

    $('a', $('#share')).each(function () {
        $(this).attr('data-url', currUrl);  
    });
}
