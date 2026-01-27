const ingredientsWrap = document.getElementById("ingredientsWrap");
const stepsWrap = document.getElementById("stepsWrap");
const addIngredientBtn = document.getElementById("addIngredientBtn");
const addStepBtn = document.getElementById("addStepBtn");

const form = document.getElementById("addRecipeForm");
const errorBox = document.getElementById("errorBox");

let ingredientCount = 1;
let stepCount = 1;

 
// (+) Add Ingredient
 
addIngredientBtn.addEventListener("click", () => {
  ingredientCount++;

  const row = document.createElement("div");
  row.className = "inline";
  row.setAttribute("data-ingredient", "");

  row.innerHTML = `
    <span class="small-label">Ingredient ${ingredientCount}:</span>
    <label class="mini">Name:</label>
    <input type="text" required />
    <label class="mini">Quantity:</label>
    <input type="text" required />
  `;

  ingredientsWrap.appendChild(row);
});

 
// (+) Add Step
 addStepBtn.addEventListener("click", () => {
  stepCount++;

  const row = document.createElement("div");
  row.className = "inline";
  row.setAttribute("data-step", "");

  row.innerHTML = `
    <span class="small-label">Step ${stepCount}:</span>
    <input type="text" required />
  `;

  stepsWrap.appendChild(row);
});

 
// Form Validation + Redirect
 
form.addEventListener("submit", (e) => {
  e.preventDefault();
  errorBox.textContent = "";

  const name = document.getElementById("recipeName").value.trim();
  const category = document.getElementById("category").value;
  const description = document.getElementById("description").value.trim();
  const photoInput = document.getElementById("photo");

  const videoUrl = (document.getElementById("videoUrl").value || "").trim();
  const videoFileInput = document.getElementById("videoFile");
  const hasVideoFile = videoFileInput.files && videoFileInput.files.length > 0;

  // Required: name, category, description
  if (!name || !category || !description) {
    errorBox.textContent =
      "Please fill all required fields (Name, Category, Description).";
    return;
  }

  // Required: photo
  if (!photoInput.files || photoInput.files.length === 0) {
    errorBox.textContent =
      "Please upload a recipe photo.";
    return;
  }

  // Required: ingredients
  const ingredientRows =
    ingredientsWrap.querySelectorAll("[data-ingredient]");
  for (const row of ingredientRows) {
    const inputs = row.querySelectorAll("input");
    const ingName = inputs[0].value.trim();
    const ingQty = inputs[1].value.trim();

    if (!ingName || !ingQty) {
      errorBox.textContent =
        "Please complete all ingredient fields.";
      return;
    }
  }

  // Required: steps
  const stepRows =
    stepsWrap.querySelectorAll("[data-step]");
  for (const row of stepRows) {
    const stepText = row.querySelector("input").value.trim();
    if (!stepText) {
      errorBox.textContent =
        "Please complete all instruction steps.";
      return;
    }
  }

  // Optional: video (URL or file or none)
  // (No action needed, requirement satisfied)

  //  If everything is valid → go to My Recipes
  window.location.href = "myRecipe.html";
});
document.addEventListener("DOMContentLoaded", function () {
  var logoutBtn = document.getElementById("logoutBtn");

  if (logoutBtn !== null) {
    logoutBtn.onclick = function () {
      window.location.href = "login.html";
    };
  }
});