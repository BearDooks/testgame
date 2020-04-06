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
    if (item in resources){
        resources[item] = resources[item] + (1 * modifiers[item]);
        document.getElementById(item).innerText = resources[item];
        burn_player_stamina(1)
    }
    else{
        console.log(item + " is not a resouce we track....cheater")
    }
    
}

function heal_player(amount){
    player.health = (player.health + amount);
    if (player.health > player.max_health){
        player.health = player.max_health
    }
}

// Burn player stamina, for each stamina you go below 0, lose 2 health
function burn_player_stamina(amount){
    for (let x = 0; x < amount; x++){
        player.stamina --;
        if (player.stamina < 0){
            player.stamina = 0;
            player.health = (player.health - 2);
        }
    }
        update_player_info();
}

function craft_item(item){
    items[item] = 1
}

// Sleep heals the player, refills stamina, and advances the day by 1
function sleep(){
    heal_player(5);
    player.stamina = player.max_stamina;
    day.daynumber ++;
    for (var key in day) {
        document.getElementById(key).innerText = day[key];
    }
    update_player_info();
}

// Pick some random weather for the next day
function random_weather(){

}

function update_player_info(){
    var health_percent = (player.health / player.max_health) * 100;
    document.getElementById("health_bar").setAttribute("style",("width: " + health_percent + "%"));
    document.getElementById("health_label").innerText = ("Health: " + player.health + " / " + player.max_health);
    var stamina_percent = (player.stamina / player.max_stamina) * 100;
    document.getElementById("stamina_bar").setAttribute("style",("width: " + stamina_percent + "%"));
    document.getElementById("stamina_label").innerText = ("Stamina: " + player.stamina + " / " + player.max_stamina);
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
    day = {daynumber:1, weather:'Sunny'};
    items = {};
    buildings = {};
    player = {max_health:100,health:100,max_stamina:20,stamina:20};
    update_player_info();
}

// Save the game to the browser local storage
function save_game(){
    var save = {
        village_name: village_name,
        day, day,
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
        if (typeof savegame.day !== "undefined") day = savegame.day;
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
        console.log("Erasing Data");
        localStorage.removeItem("save");
    }
    fresh_game();
}

// Show the FAQ modal of the game
function show_faq(){
    $('#faq_modal').modal()
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
