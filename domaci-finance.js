function createSelectYear() {
    // // get parent div
    // var parentDiv = document.getElementById("select-year-container");

    // // create select and add it to parent
    // var selectYear = document.createElement("select");
    // selectYear.id = "select-year";
    // parentDiv.appendChild(selectYear);
    
    // add options and set actual
    var selectYear = document.getElementById("years");

    var actualYear = new Date().getFullYear()
    for (i = 2020; i < actualYear + 1; i++) {
        var option = document.createElement("option");
        option.value = i;
        option.text = i;
        selectYear.appendChild(option);
    }
    selectYear.value = actualYear;
}


// <select name="years" id="years" onchange="main()" style="font-size: 1.5em;">
// <option value=2020>2020</option>
// <option value="2021">2021</option>
// <option value="2022">2022</option>
// <option value="2023">2023</option>
// </select>