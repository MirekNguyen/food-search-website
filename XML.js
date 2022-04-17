function search(suggestions) {
    const input = document.getElementById('inputBox');
    input.onkeyup = (e) => {
        let userData = e.target.value;
        let array = [];
        if (userData) {
            array = suggestions.filter((data) => {
                return data.toLocaleLowerCase().startsWith(userData.toLocaleLowerCase());
            });
            array = array.map((data)=> {
                return "<li onclick=requestDetails(this) id=\"" +  data + "\">" + data + "<li>";
            })
            suggestion_html.innerHTML = "";
            for (let item of array)
            {
                createParagraph(suggestion_html, item);
                console.log(item);
            }
        }
    }
}

function requestDetails(recipe) {
    console.log("You clicked on me!");
    console.log(recipe.id);
    const xml = new XMLHttpRequest();
    xml.onload = function(e) {
        console.log(JSON.parse(xml.response));
        addRecipe(JSON.parse(xml.response));
    }
    xml.open("GET", "RequestDetails.php?details=true" + "&" + "recipe=" + recipe.id);
    xml.send();
}

function addRecipe(text) {
    let recipeContainer = document.getElementById('recipeContainer');
    p = document.createElement('p');
    let sum = 0;
    for (let item of text) {
        console.log(item);
        p.innerHTML += item['item'] + " " + item['price'] + "czk " + item['calories_per_100g'] + "cal " + item['weight'] + "g " + item['amount'] + "g";
        sum += parseFloat(item['calories_per_100g']) * parseFloat(item['amount']) / 100;
        p.innerHTML += " => " + (parseFloat(item['calories_per_100g']) * parseFloat(item['amount']) / 100).toString() + " calories<br>";
    }
    p.innerHTML += "Calories: " + sum.toFixed(2) + "<br>";
    recipeContainer.appendChild(p)
}

function createParagraph(parent, text) {
    p = document.createElement('p');
    p.innerHTML = text;
    parent.appendChild(p);
}

let suggestion_html = document.getElementById('suggestion_html');


const xml = new XMLHttpRequest();
let json, parse;
xml.onload = function(e) {
    json = xml.response;
    parse = JSON.parse(json);
    console.log(parse);
    let suggestions = [];
    for (let item of parse) {
        suggestions.push(item);
    }
    search(suggestions);
}
xml.open("GET", "AJAX.php");
xml.send();
