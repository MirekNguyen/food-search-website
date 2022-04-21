load();

const suggestion_html = document.getElementById('suggestion_html');

// Onload of website, grab all recipes
function load() {
    const xml = new XMLHttpRequest();
    let json, parse;
    xml.onload = function () {
        json = xml.response;
        parse = JSON.parse(json);
        console.log(parse);
        let suggestions = [];
        let itemType = [];
        let suggestionsID = [];
        for (let array in parse) {
            for (let item of parse[array]) {
                suggestionsID[Object.values(item)[0]] = Object.keys(item)[0];
                suggestions.push(Object.values(item)[0]);
                itemType[Object.keys(item)[0]] = array;
            }
        }
        search(suggestions, itemType, suggestionsID);
    }
    xml.open("GET", "AJAX.php");
    xml.send();
}

function includeWord(userData, suggestions, itemType, suggestionsID) {
    const includes = suggestions.filter((data) => {
        return data.toLocaleLowerCase().includes(userData.toLocaleLowerCase());
    });
    let array = includes.filter((data) => {
        return data.toLocaleLowerCase().startsWith(userData.toLocaleLowerCase());
    });
    array.push(...includes.filter((data) => {
        return !(data.toLocaleLowerCase().startsWith(userData.toLocaleLowerCase()));
    }));
    array = array.map((data) => {
        let type = itemType[suggestionsID[data]];
        let id = suggestionsID[data];
        return "<li onclick=requestDetails(this," + "\"" + type + "\""  + ") id=\"" + id + "\">" + data + "<li>";
    })
    return array;
}



// After all recipes all loaded, start function, to search for recipes when user types a word
function search(suggestions, itemType, suggestionsID) {
    const input = document.getElementById('inputBox');
    input.onkeydown = (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            if (suggestion_html.firstElementChild) {
                input.value = suggestion_html.firstChild.firstChild.textContent;
            }
        }
    }
    input.onkeyup = (e) => {
        console.log(e.key);
        if (e.key === 'ArrowUp') {
            console.log("You pressed arrow up!");
            return;
        }
        else if (e.key === 'ArrowDown') {
            console.log("You pressed arrow down!");
            return;
        }

        let userData = e.target.value;
        if (!userData) {
            suggestion_html.innerHTML = "";
            return;
        }
        let array = includeWord(userData, suggestions, itemType, suggestionsID);

        // Clear suggestion
        suggestion_html.innerHTML = "";
        // Create a paragraph for each recipe that matches with typed word
        for (let item of array) {
            createParagraph(suggestion_html, item);
        }
        if (suggestion_html.firstElementChild) {
            let firstChild = suggestion_html.firstElementChild;
            // firstChild.firstElementChild.style.backgroundColor = "ghostwhite";
            if (e.key === 'Enter') {
                firstChild.firstElementChild.click();
                input.value = firstChild.firstChild.textContent;
            }
        }

    }
}

function createParagraph(parent, text) {
    let p = document.createElement('p');
    p.innerHTML = text;
    parent.appendChild(p);
}

// After user clicks on recipe, query database where it searches for all information related to recipe
function requestDetails(recipe, type) {
    console.log(recipe);
    if (type === "recipes") {
    const xml = new XMLHttpRequest();
    xml.onload = function () {
        console.log(JSON.parse(xml.response));
        addRecipe(JSON.parse(xml.response), type);
    }
    xml.open("GET", "RequestDetails.php?type=" + type + "&details=true" + "&" + "recipe=" + recipe.id);
    xml.send();
    }
    else if (type === "ingredients")
    {
        console.log(recipe);
        const xml = new XMLHttpRequest();
        xml.onload = function () {
            console.log(xml.response);
            console.log(JSON.parse(xml.response));
            addRecipe(JSON.parse(xml.response), type);
        }
        xml.open("GET", "RequestDetails.php?type=" + type + "&details=true" + "&" + "recipe=" + recipe.id);
        xml.send();
    }
}

// After getting response from database *func. requestDetails()* provide information to user
function addRecipe(text, type) {
    let recipeContainer = document.getElementById('container');
    // recipeContainer.innerHTML = "";
    let p = document.createElement('p');
    p.id = 'shownItem';
    let sumCalories = 0;
    let sumPricePortion = 0;
    let sumFullPrice = 0;
    if (type === "ingredients") {
        for (let item of text) {
            sumCalories += parseFloat(item['calories_per_100g']) * parseFloat(item['weight']) / 100;
        p.innerHTML += "<h3>" + item['name'] + "</h3>";
        p.innerHTML += item['price'] + "czk " + item['calories_per_100g'] + "cal " + item['weight'] + "g<br>";
        }
        p.innerHTML += "Calories: " + sumCalories.toFixed(2) + "<br>";
        if (document.getElementById('shownItem')) {
        recipeContainer.removeChild(document.getElementById('shownItem')); }
        recipeContainer.appendChild(p);
    }
    else if (type === "recipes"){
        let addedTitle = false;
        let ingredients = "";
        for (let item of text) {
            if (addedTitle === false) {
                addedTitle = true;
                p.innerHTML += "<h3>" + item['recipename'] + "</h3>";
            }
            ingredients += "<p>" + item['name'] + " " + item['price'] + "czk " + item['calories_per_100g'] + "cal " + item['weight'] + "g " + item['amount'] + "g" + " => " + (parseFloat(item['calories_per_100g']) * parseFloat(item['amount']) / 100).toString() + " calories" +  "</p>";
            sumPricePortion += parseFloat(item['amount']) / parseFloat(item['weight']) * parseFloat(item['price']);
            sumFullPrice += parseFloat(item['price']);
            sumCalories += parseFloat(item['calories_per_100g']) * parseFloat(item['amount']) / 100;
        }
        p.innerHTML += sumCalories.toFixed(2) + "cal ";
        p.innerHTML += sumPricePortion.toFixed(2) + "czk ";
        p.innerHTML += sumFullPrice.toFixed(2) + "czk<br>";
        p.innerHTML += ingredients;
        if (document.getElementById('shownItem')) {
            recipeContainer.removeChild(document.getElementById('shownItem')); }
        recipeContainer.appendChild(p);
    }
    // Clear input and suggestion
    const input = document.getElementById('inputBox');
    input.value = "";
    suggestion_html.innerHTML = "";
}
