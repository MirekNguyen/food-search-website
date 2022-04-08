<!DOCTYPE html>
<html lang="en">
<meta charset="UTF-8">
<title>Food</title>

<body>
   <div class="centrer">
      <input type="text" id="inputBox"><br>
      <textarea name="" id="textBox" cols="30" rows="10"></textarea>
   </div>
</body>
<script>
   function search(suggestions) {
      var input = document.getElementById('inputBox');
      var textBox = document.getElementById('textBox');
      textBox.setAttribute('cols', '0');
      input.onkeyup = (e) => {
         var userData = e.target.value;
         var array = [];
         if (userData) {
            array = suggestions.filter((data) => {
               return data.toLocaleLowerCase().startsWith(userData.toLocaleLowerCase());
            });
            array = array.map((data) => {
               return "<li>" + data + "<li>";
            })
            console.log(array);
         }
      }
   }

   var xml = new XMLHttpRequest();
   var json, parse;
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
</script>

</html>
