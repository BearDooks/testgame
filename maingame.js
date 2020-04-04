const title = "Remote Island Survival v 0.1"

// Setup app
document.title = title // Set HTML title

// Variables
var village_name = ""

var player = {
    health: 100,
    stamina: 20
}

var resources = {
    palm:0,
    wood:0,
    stone:0,
    ore:0
}

var modifiers = {
    wood:1,
    stone:1,
    ore:1
}

var items = {

}

var buildings = {

}

// Main function called every 1 second
function main(){
    update_page()
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

function gather_resource(item){
    resources[item] = resources[item] + (1 * modifiers[item]);
    document.getElementById(item).innerText = resources[item];
    player.stamina - 1
}

function craft_item(){
    //TODO: Setup Crafting
}


// Used to update all the information on the screen
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
    items = {};
    buildings = {};
    player = {health:100, stamina:20}
}

// Save the game to the browser local storage
function save_game(){
    var save = {
        village_name: village_name,
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
        if (typeof savegame.village_name !== "undefined") village_name = savegame.village_name;
        if (typeof savegame.resources !== "undefined") resources = savegame.resources;
        if (typeof savegame.modifiers !== "undefined") modifiers = savegame.modifiers;
        if (typeof savegame.items !== "undefined") items = savegame.items;
        if (typeof savegame.buildings !== "undefined") buildings = savegame.buildings;

        update_village_name(village_name)
    }
}

// Remove player save data, warns user before you do this
function erase_save_data(){
    var confirm_erase_data = confirm("Are you sure you want to do this?\nThis will remove all traces of your save game and restart");
    if (confirm_erase_data == true){
        localStorage.removeItem("save");
    }
    fresh_game();
}

// Displays alerts to the player when called
// alert-success, alert-warning, alert-error, alert-info
function show_alert(message,alerttype) {
    $('#alert_placeholder').append('<div id="alertdiv" class="alert ' +  alerttype + ' alert-dismissable fade show"><a class="close" data-dismiss="alert">x</a><span>'+message+'</span></div>')
    setTimeout(function() { // this will automatically close the alert and remove this if the users doesnt close it
        $("#alertdiv").remove();
    }, 5000);
}

setInterval(main, 1000); // Run main every 1 second
setInterval(save_game,300000); // Run save_game every 5 min

window.onload = load_game();
