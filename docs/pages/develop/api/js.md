Javascript

<script>

let ASTRA_DB_ID="dde308f5-a8b0-474d-afd6-81e5689e3e25"
let ASTRA_DB_REGION="eu-central-1"
let ASTRA_DB_TOKEN="AstraCS:gdZaqzmFZszaBTOlLgeecuPs:edd25600df1c01506f5388340f138f277cece2c93cb70f4b5fa386490daa5d44"

function listKeyspaces() {
    var url = "https://" + ASTRA_DB_ID + "-" + ASTRA_DB_REGION +".apps.astra.datastax.com/api/rest/v2/namespaces/ks_mtg/collections";
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.setRequestHeader("X-Cassandra-Token", ASTRA_DB_TOKEN);
    xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
        console.dir(xhr.responseText);
    }};
    xhr.send();
}

function listDatabases() {
    var url= "https://api.astra.datastax.com/v2/databases?include=nonterminated&provider=ALL&limit=25";
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.setRequestHeader("Authorization", "Bearer " + ASTRA_DB_TOKEN);
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("Access-Control-Allow-Headers","Content-Type");
    xhr.setRequestHeader("Access-Control-Allow-Methods","*");
    xhr.setRequestHeader("Access-Control-Allow-Origin", "api.astra.datastax.com");
    xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
    console.log(xhr.status);
    console.log(xhr.responseText);
    }};
    xhr.send();
}

listKeyspaces();
listDatabases();
</script>
