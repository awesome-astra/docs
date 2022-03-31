/* This file contains functions to build the swagger Dashboard. */

/* ----------------------------------------------------------- */
/* --------------------- DB SELECTOR ------------------------- */
/* ----------------------------------------------------------- */

function dbSelectorListDatabases(astraToken) {
  console.log("Look up databases with token " + astraToken);
  document.querySelector("#block_astra_region").innerHTML = "";
  document.querySelector("#block_astra_namespace").innerHTML = "";
  let targetDiv = document.querySelector("#block_astra_db");
  targetDiv.innerHTML = "";
  targetDiv.innerHTML +=
    '<label class="label" for="astra_db"><i class="fa fa-database"></i> &nbsp;Pick a Database</label><br/>';
  targetDiv.innerHTML +=
    '<select class="select" id="astra_db" name="astra_db" style="width:70%" onchange="dbSelectorListRegions(document.getElementById(\'astra_token\').value, document.getElementById(\'astra_db\').value)"><option selected disabled>-</option><option value="dde308f5-a8b0-474d-afd6-81e5689e3e25">mtg</option><option value="3ed83de7-d97f-4fb6-bf9f-82e9f7eafa23">workshops</option><option value="7e96f835-267b-43ce-b2fb-97eabb535932">sdk_test</option><option value="0d8a8243-ab72-4956-8237-79c76850befb">live_workshops</option></select>';
}

function dbSelectorListRegions(astraToken, dbid) {
  console.log("Look up regions with db " + dbid);
  document.querySelector("#block_astra_namespace").innerHTML = "";
  let targetDiv = document.querySelector("#block_astra_region");
  targetDiv.innerHTML = "";
  targetDiv.innerHTML +=
    '<label class="label" for="astra_region"><i class="fa fa-map"></i> &nbsp;Pick a Region</label><br/>';
  targetDiv.innerHTML +=
    '<select class="select" id="astra_region" name="astra_region" style="width:70%" onchange="dbSelectorKeyspaces(document.getElementById(\'astra_token\').value, document.getElementById(\'astra_db\').value, document.getElementById(\'astra_region\').value)"><option selected disabled>-</option><option value="eu-central-1">eu-central-1</option><option value="eu-west-1">eu-west-1</option></select>';
}

function dbSelectorKeyspaces(astraToken, dbid, dbregion) {
  console.log("Look up keyspaces with db " + dbid);
  setupAstraDBEndpoint(dbid, dbregion);
  let targetDiv = document.querySelector("#block_astra_namespace");

  let select =
    '<select class="select" id="astra_namespace" name="astra_namespace" style="width:70%"><option selected disabled>-</option>';
  // Invoke Stargate to list namespace
  var url =
    "https://" +
    dbid +
    "-" +
    dbregion +
    ".apps.astra.datastax.com/api/rest/v2/schemas/namespaces/";
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url);
  xhr.setRequestHeader("X-Cassandra-Token", astraToken);
  xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      JSON.parse(xhr.responseText).data.forEach(function (item, index) {
        //console.log("Namespace" + item.name);
        select +=
          '<option value="' + item.name + '">' + item.name + "</option>";
      });
      select += "</select>";
      targetDiv.innerHTML = "";
      targetDiv.innerHTML += '<label class="label" for="astra_namespace">';
      targetDiv.innerHTML += '<i class="fa fa-bookmark"></i>';
      targetDiv.innerHTML += "&nbsp;Pick a Namespace</label><br/>";
      targetDiv.innerHTML += select;
    }
  };
  xhr.send();
}

function dbSelectorFindDatabasesInCurrentOrg() {
  let astraCSToken = document.getElementById("astra_token").value;
  var url =
    "https://api.astra.datastax.com/v2/databases?include=nonterminated&provider=ALL&limit=25";
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url);
  xhr.setRequestHeader("Authorization", "Bearer " + astraCSToken);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      console.log(xhr.status);
      console.log(xhr.responseText);
    }
  };
  xhr.send();
}

/* ----------------------------------------------------------- */
/* ---------------   Change Swaggger Target   ---------------- */
/* ----------------------------------------------------------- */

/**
 * Add a dynamic destination for a Swagger UI package
 *
 * @author Cedrick Lunven
 */
const UrlMutatorPlugin = (system) => ({
  rootInjects: {
    setScheme: (scheme) => {
      const jsonSpec = system.getState().toJSON().spec.json;
      const schemes = Array.isArray(scheme) ? scheme : [scheme];
      const newJsonSpec = Object.assign({}, jsonSpec, { schemes });
      return system.specActions.updateJsonSpec(newJsonSpec);
    },
    setHost: (host) => {
      const jsonSpec = system.getState().toJSON().spec.json;
      const newJsonSpec = Object.assign({}, jsonSpec, { host });
      return system.specActions.updateJsonSpec(newJsonSpec);
    },
    setBasePath: (basePath) => {
      const jsonSpec = system.getState().toJSON().spec.json;
      const newJsonSpec = Object.assign({}, jsonSpec, { basePath });
      return system.specActions.updateJsonSpec(newJsonSpec);
    },
  },
});

/**
 * Leveraging the 'UrlMutatorPlugin' to dynamically define target for Swagger UI
 *
 * @author Cedrick Lunven
 */
function setupAstraDBEndpoint(dbid, dbregion) {
  window.ui.setScheme("https");
  window.ui.setHost(dbid + "-" + dbregion + ".apps.astra.datastax.com");
  window.ui.setBasePath("/api/rest");
  console.log(
    "Api Endpoint:" + dbid + "-" + dbregion + ".apps.astra.datastax.com"
  );
}

/* ----------------------------------------------------------- */
/* --------------- Populated Swagger Forms  ------------------ */
/* ----------------------------------------------------------- */

function hookSwagger() {
  let swaggerOperations = document.querySelectorAll(".opblock-summary");
  for (const swaggerOp of swaggerOperations) {
    swaggerOp.addEventListener("click", function (event) {
      setTimeout(fillSwaggerForm, 100);
      setTimeout(hookTryItOutButton, 100);
      setTimeout(hookExecuteButton, 100);
    });
  }
  console.log("Swagger operations are now hooked");
}

function hookTryItOutButton() {
  console.log("Hook Try-it-out");
  let swaggerOperations = document.querySelectorAll(".try-out__btn");
  for (const swaggerOp of swaggerOperations) {
    swaggerOp.addEventListener("click", function (event) {
      setTimeout(fillSwaggerForm, 100);
      setTimeout(hookExecuteButton, 100);
    });
  }
}

function hookExecuteButton() {
  let swaggerOperations = document.querySelectorAll(".execute");
  for (const swaggerOp of swaggerOperations) {
    swaggerOp.addEventListener("click", function (event) {
      event.preventDefault();
    });
  }
}

function fillSwaggerForm() {
  let inputFields = document.querySelectorAll("input[type=text]");
  for (const inputField of inputFields) {
    if (
      inputField.hasAttribute("placeholder") &&
      inputField.getAttribute("placeholder").startsWith("X-Cassandra-Token")
    ) {
      inputField.value = document.getElementById("astra_token").value;
      inputField.style.color = "#008800";
      inputField.style.backgroundColor = "#eeffee";
      inputField.style.border = "1px solid #008800";
      inputField.dispatchEvent(new Event("change"));
      inputField.dispatchEvent(new Event("blur"));
      inputField.dispatchEvent(new Event("onblur"));
      inputField.dispatchEvent(new Event("onchange"));
    } else if (
      inputField.hasAttribute("placeholder") &&
      inputField.getAttribute("placeholder").startsWith("namespace-id")
    ) {
      inputField.value = document.getElementById("astra_namespace").value;
      inputField.style.color = "#008800";
      inputField.style.backgroundColor = "#eeffee";
      inputField.style.border = "1px solid #008800";
      inputField.dispatchEvent(new Event("change"));
      inputField.dispatchEvent(new Event("onchange"));
      inputField.dispatchEvent(new Event("blur"));
      inputField.dispatchEvent(new Event("onblur"));
    }
  }
}
