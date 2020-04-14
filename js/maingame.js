const title = "Remote Island Survival v 0.1"

// Setup app
document.title = title // Set HTML title

// Variables
var village_name = ""

var day = {
    daynumber:1,
    weather:"sunny"
}

var player = {
    max_health: 100,
    health: 100,
    max_stamina:20,
    stamina: 20
}

var resources = {
    palm:0,
    wood:0,
    stone:0
}

var modifiers = {
    palm:1,
    wood:1,
    stone:1
}

var items = {
    none:1
}

var buildings = {
    none:1
}

// List of craftable items
// ID, name, palm, wood, stone, previous items needed, tooltip to be displayed
const craftable = [
    {id:"palmbed", item_name:"Palm Bed", item_type:"bed", palm_cost:10, wood_cost:0, stone_cost:0, previous_item:"none", previous_building:"none", tooltip:"A simple bed to sleep on" },
    {id:"palmpants", item_name:"Palm Pants", item_type:"pants", palm_cost:5, wood_cost:0, stone_cost:0, previous_item:"Palm Bed", previous_building:"none", tooltip:"Pants made from palm leaves"},
    {id:"palmshirt", item_name:"Palm Shirt", item_type:"shirt", palm_cost:5, wood_cost:0, stone_cost:0, previous_item:"Palm Bed", previous_building:"none", tooltip:"A shirt made from palm leaves, protects you from the sun"},
    {id:"stoneaxe", item_name:"Stone Axe", item_type:"axe", palm_cost:5, wood_cost:0, stone_cost:0, previous_item:"none", previous_building:"Simple Craft Bench", tooltip:"An axe made with a stone"},
]

// List of buildings that can be constructed
// ID, name, palm, wood, stone, previous items needed, tooltip to be displayed
const buildable = [
    {id:"leanto", item_name:"Leanto", item_type:"shelter", palm_cost:20, wood_cost:10, stone_cost:0, previous_item:"none", previous_building:"none", tooltip:"A simple leanto to sleep in, protects you from some weather"},
    {id:"simplecraftbench", item_name:"Simple Craft Bench", item_type:"crafting", palm_cost:0, wood_cost:20, stone_cost:0, previous_item:"none", previous_building:"Leanto", tooltip:"A simple craft bench to make simple tools"},
]

// List of different weather that can happen
const weather = [
    {key:0, id:"Sunny", item_type_needed:"none", negative_health_effect:0, negative_stamina_effect:0},
    {key:1, id:"Very Sunny", item_type_needed:"shirt", negative_health_effect:0, negative_stamina_effect:2},
    {key:2, id:"Cloudy", item_type_needed:"none", negative_health_effect:0, negative_stamina_effect:0},
    {key:3, id:"Overcast", item_type_needed:"none", negative_health_effect:0, negative_stamina_effect:0},
    {key:4, id:"Windy", item_type_needed:"none", negative_health_effect:0, negative_stamina_effect:0},
    {key:5, id:"Foggy", item_type_needed:"none", negative_health_effect:0, negative_stamina_effect:0},
    {key:6, id:"Raining", item_type_needed:"shelter", negative_health_effect:10, negative_stamina_effect:5}
]

// Main function called every 1 second
function main(){
    update_page()
    $('[data-toggle="tooltip"]').tooltip();
}

// Asks the player to rename the village
function village_name_input(){
    $('#village_name_modal').modal()
}

// Update the vilage name to something
function update_village_name(new_name){
    village_name = new_name;
    document.getElementById('village_name').innerText = village_name;
}

// Used to gather resources from the island
function gather_resource(item){
    if (item in resources){
        resources[item] = resources[item] + (1 * modifiers[item]);
        document.getElementById(item).innerText = resources[item];
        burn_player_stamina(1)
    }
    else{
        console.log(item + " is not a resouce we track....cheater")
    }
}

// Used to heal the player by some amount passed to it
function change_player_health(amount){
    player.health = (player.health + amount);
    if (player.health > player.max_health){
        player.health = player.max_health
    }
    if (player.health <= 0){
        gameover()
    }
}

// Burn player stamina, for each stamina you go below 0, lose 2 health
function burn_player_stamina(amount){
    for (var i = 0; i < amount; i++){
        player.stamina --;
        if (player.stamina < 0){
            player.stamina = 0;
            change_player_health(-2);
        }
    }
        update_player_info();
}

// Used to build an item from the list
function build(item){
    var array = buildable;
    var property = "id";
    var property_value = item;

    for (var i=0; i < array.length; i++){
        if (array[i][property] == property_value)
        var returned = array[i];
    }

    if (returned.palm_cost <= resources.palm && returned.wood_cost <= resources.wood && returned.stone_cost <= resources.stone && returned.previous_item in items && returned.previous_building in buildings){
        $('#' + property_value).tooltip('hide')
        resources.palm = resources.palm - returned.palm_cost;
        resources.wood = resources.wood - returned.wood_cost;
        resources.stone = resources.stone - returned.stone_cost;
        buildings[returned.item_name] = 1;
        update_craft_build();
    }
    else{
        console.log("I did not build it")
    }
}

// Used to craft an item from the list. 
function craft_item(item){
    var array = craftable;
    var property = "id";
    var property_value = item;

    for (var i=0; i < array.length; i++){
        if (array[i][property] == property_value)
        var returned = array[i];
    }

    if (returned.palm_cost <= resources.palm && returned.wood_cost <= resources.wood && returned.stone_cost <= resources.stone && returned.previous_item in items && returned.previous_building in buildings){
        $('#' + property_value).tooltip('hide')
        resources.palm = resources.palm - returned.palm_cost;
        resources.wood = resources.wood - returned.wood_cost;
        resources.stone = resources.stone - returned.stone_cost;
        items[returned.item_name] = 1;
        update_craft_build();
    }
    else{
        console.log("I did not make it")
    }
}

// Used to update crafting buttons
function update_craft_build(){
    document.getElementById("craft_placeholder").innerHTML = "";
    var returned_array = [];
    for (var i=0; i < craftable.length; i++){
        if(!(craftable[i].item_name in items) && (craftable[i].previous_item in items) && (craftable[i].previous_building in buildings)){
            returned_array.push(craftable[i]);
        }
    }
    for (var i = 0; i < returned_array.length; i++) {
        var item_name = returned_array[i].item_name;
        var item_id = returned_array[i].id;
        var item_tooltip = returned_array[i].tooltip;
        var item_cost = "- "
        if (returned_array[i].palm_cost > 0){
            item_cost = item_cost + " Palm: " + returned_array[i].palm_cost
        }
        if (returned_array[i].wood_cost > 0){
            item_cost = item_cost + " Wood: " + returned_array[i].wood_cost
        }
        if (returned_array[i].stone_cost > 0){
            item_cost = item_cost + " Stone: " + returned_array[i].stone_cost
        }
        document.getElementById("craft_placeholder").innerHTML += "<button type='button' class='btn btn-info' id=" + item_id + " onclick=craft_item('" + item_id + "') data-toggle='tooltip' data-placement='right' title='" + item_tooltip + "'>" + item_name + " " + item_cost + "</button>";
    }

    document.getElementById("currentitems").innerHTML = ""
    for (var key in items){
        if(key != "none"){
        document.getElementById("currentitems").innerHTML += "<li>" + key + "</li>";
        }
    }

    document.getElementById("build_placeholder").innerHTML = "";
    var returned_array = [];
    for (var i=0; i < buildable.length; i++){
        if(!(buildable[i].item_name in buildings) && (buildable[i].previous_item in items) && (buildable[i].previous_building in buildings)){
            returned_array.push(buildable[i]);
        }
    }
    for (var i = 0; i < returned_array.length; i++) {
        var item_name = returned_array[i].item_name;
        var item_id = returned_array[i].id;
        var item_tooltip = returned_array[i].tooltip;
        var item_cost = "- "
        if (returned_array[i].palm_cost > 0){
            item_cost = item_cost + " Palm: " + returned_array[i].palm_cost
        }
        if (returned_array[i].wood_cost > 0){
            item_cost = item_cost + " Wood: " + returned_array[i].wood_cost
        }
        if (returned_array[i].stone_cost > 0){
            item_cost = item_cost + " Stone: " + returned_array[i].stone_cost
        }
        // data-toggle="tooltip" data-placement="right" title="Tooltip on right"
        document.getElementById("build_placeholder").innerHTML += "<button type='button' class='btn btn-info' id=" + item_id + " onclick=build('" + item_id + "') data-toggle='tooltip' data-placement='right' title='" + item_tooltip + "'>" + item_name + " " + item_cost + "</button>";
    }

    document.getElementById("currentbuildings").innerHTML = ""
    for (var key in buildings){
        if(key != "none"){
        document.getElementById("currentbuildings").innerHTML += "<li>" + key + "</li>";
        }
    }

}

// Sleep heals the player, refills stamina, and advances the day by 1
function sleep(){
    change_player_health(5);
    player.stamina = player.max_stamina;
    day.daynumber ++;
    document.getElementById("daynumber").innerText = day.daynumber;
    random_weather();
    update_player_info();
}

// Pick some random weather for the next day
function random_weather(){
    var new_weather = weather[Math.floor(Math.random()*weather.length)];
    document.getElementById("weather").innerText = new_weather.id;
    if (!(new_weather.item_type_needed in items) && !(new_weather.item_type_needed in buildings)){
        if (new_weather.negative_stamina_effect > 0 && new_weather.negative_health_effect == 0){
            show_info("Today is " + new_weather.id + " ,and you don't have a " + new_weather.item_type_needed + " so you lost " + new_weather.negative_stamina_effect + " Stamina")
        }
        if (new_weather.negative_stamina_effect == 0 && new_weather.negative_health_effect > 0){
            show_info("Today is " + new_weather.id + " ,and you don't have a " + new_weather.item_type_needed + " so you lost " + new_weather.negative_health_effect + " Health")
        }
        if (new_weather.negative_stamina_effect > 0 && new_weather.negative_health_effect > 0){
            show_info("Today is " + new_weather.id + " ,and you don't have a " + new_weather.item_type_needed + " so you lost " + new_weather.negative_stamina_effect + " Stamina and " + new_weather.negative_health_effect + " Health")
        }
        else{
            console.log("Nothing to report")
        }
        
    }
    else{
        console.log("You got what you need")
    }
}

// Updates the player info section for the game
function update_player_info(){
    var health_percent = (player.health / player.max_health) * 100;
    document.getElementById("health_bar").setAttribute("style",("width: " + health_percent + "%"));
    document.getElementById("health_label").innerText = ("Health: " + player.health + " / " + player.max_health);
    var stamina_percent = (player.stamina / player.max_stamina) * 100;
    document.getElementById("stamina_bar").setAttribute("style",("width: " + stamina_percent + "%"));
    document.getElementById("stamina_label").innerText = ("Stamina: " + player.stamina + " / " + player.max_stamina);
}

// Used to update all the information on the screen for the player
function update_page(){
    for (var key in resources) {
        document.getElementById(key).innerText = resources[key];
    }
}

// Used to create a fresh instance of the game
function fresh_game(){
    update_village_name("Unknown Village");
    for (var key in resources) {
        resources[key] = 0;
    }
    for (var key in modifiers) {
        modifiers[key] = 1
    }
    day = {daynumber:1, weather:'Sunny'};
    items = {none:1};
    buildings = {none:1};
    player = {max_health:100,health:100,max_stamina:20,stamina:20};
    document.getElementById("daynumber").innerText = day.daynumber;
    document.getElementById("weather").innerText = day.weather;
    update_player_info();
    update_craft_build();
}

// Save the game to the browser local storage
function save_game(){
    var save = {
        player: player,
        village_name: village_name,
        day: day,
        resources: resources,
        modifiers: modifiers,
        items: items,
        buildings: buildings
    }
    localStorage.setItem("save",JSON.stringify(save));
    show_alert("Game Saved", "alert-info")
    console.log("Game Saved");
}

// Load the game from the browser local storage
function load_game(){ 
    if (localStorage.getItem("save") === null) {
        console.log("No save game detected")
        fresh_game();
    }
    else {
        var savegame = JSON.parse(localStorage.getItem("save"));
        if (typeof savegame.player !== "undefined") player = savegame.player;
        if (typeof savegame.village_name !== "undefined") village_name = savegame.village_name;
        if (typeof savegame.day !== "undefined") day = savegame.day;
        if (typeof savegame.resources !== "undefined") resources = savegame.resources;
        if (typeof savegame.modifiers !== "undefined") modifiers = savegame.modifiers;
        if (typeof savegame.items !== "undefined") items = savegame.items;
        if (typeof savegame.buildings !== "undefined") buildings = savegame.buildings;

        update_village_name(village_name);
        update_craft_build();
        update_player_info();
        update_page();
        console.log("Loaded Game")
    }
}

// Shows the export game information to the user
// converts the save game string into BASE64 for the user to copy
function export_game(){
    var data = {
        player: player,
        village_name: village_name,
        day: day,
        resources: resources,
        modifiers: modifiers,
        items: items,
        buildings: buildings
    }
    data = JSON.stringify(data);
    exported_data = window.btoa(data);
    document.getElementById("export_game_data").innerText = exported_data
    $('#export_game_modal').modal()
}

// Shows the save game import modal to the user
// Calls the import_game function from this modal
function import_game_modal(){
    $('#import_game_modal').modal()
}

// Import game data to be played again, needs some validation checking built into it
// TODO: VALIDATION OF IMPORT
function import_game(){
    var user_input = document.getElementById("import_game_data").value;
    var data = window.atob(user_input);
    var savegame = JSON.parse(data)

    if (typeof savegame.player !== "undefined") player = savegame.player;
    if (typeof savegame.village_name !== "undefined") village_name = savegame.village_name;
    if (typeof savegame.day !== "undefined") day = savegame.day;
    if (typeof savegame.resources !== "undefined") resources = savegame.resources;
    if (typeof savegame.modifiers !== "undefined") modifiers = savegame.modifiers;
    if (typeof savegame.items !== "undefined") items = savegame.items;
    if (typeof savegame.buildings !== "undefined") buildings = savegame.buildings;

    update_village_name(village_name);
    update_craft_build();
    update_player_info();
    update_page();
    console.log("Loaded Game")
}

// Remove player save data, warns user before you do this
function erase_save_data(){
    var confirm_erase_data = confirm("Are you sure you want to do this?\nThis will remove all traces of your save game and restart");
    if (confirm_erase_data == true){
        console.log("Erasing Data");
        localStorage.removeItem("save");
    }
    fresh_game();
}

// Show the FAQ modal of the game
function show_faq(){
    $('#faq_modal').modal()
}

// Show the game over screen to the user
function gameover(){
    console.log("Game Over")
    $('#gameover_modal').modal()
}

// Displays alerts to the player when called
// alert-success, alert-warning, alert-error, alert-info
function show_alert(message,alerttype) {
    $('#alert_placeholder').append('<div id="alertdiv" class="alert ' +  alerttype + ' alert-dismissable fade show"><a class="close" data-dismiss="alert">x</a><span>'+message+'</span></div>')
    setTimeout(function() { // this will automatically close the alert and remove this if the users doesnt close it
        $("#alertdiv").remove();
    }, 5000);
}

// Displays alerts to the player when called
// alert-success, alert-warning, alert-error, alert-info
function show_info(message,alerttype = "alert-warning") {
    $('#info_placeholder').append('<div id="infodiv" class="alert ' +  alerttype + ' alert-dismissable fade show"><a class="close" data-dismiss="alert">x</a><span>'+message+'</span></div>')
    setTimeout(function() { // this will automatically close the alert and remove this if the users doesnt close it
        $("#infodiv").remove();
    }, 5000);
}

function cheat(){
    resources.palm = 1000;
    resources.wood = 1000;
    resources.stone = 1000;
    update_page();
}

// Recurring functions
setInterval(main, 1000); // Run main every 1 second
setInterval(save_game,300000); // Run save_game every 5 min

window.onload = load_game();
