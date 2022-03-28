function lookupDb() {
  document.getElementById("astra_db").hidden = false;
}

function hookSwagger() {
  let swaggerOperations = document.querySelectorAll(".opblock-summary-control");
  for (const swaggerOp of swaggerOperations) {
    swaggerOp.addEventListener("click", function (event) {
      setTimeout(fillSwaggerForm, 100);
      setTimeout(hookTryItOutButton, 100);
    });
  }
}

function fillSwaggerForm() {
  let inputFields = document.querySelectorAll("input[type=text]");
  for (const inputField of inputFields) {
    // I would replace the token with value on top
    if (inputField.getAttribute("placeholder") === "X-Cassandra-Token") {
      inputField.value = document.getElementById("astra_token").value;

      var event = new Event("change");
      inputField.dispatchEvent(event);

      // Replacing the namespace Id by its values when need
    } else if (inputField.getAttribute("placeholder") === "namespace-id") {
      inputField.value = document.getElementById("astra_namespace").value;
      var event = new Event("change");
      inputField.dispatchEvent(event);
    }
  }
}

function hookTryItOutButton() {
  console.log("Try-it-out");
  let swaggerOperations = document.querySelectorAll(".try-out__btn");
  for (const swaggerOp of swaggerOperations) {
    swaggerOp.addEventListener("click", function (event) {
      setTimeout(fillSwaggerForm, 100);
    });
  }
}
