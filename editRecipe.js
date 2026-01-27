const form = document.getElementById("editRecipeForm");
const errorEl = document.getElementById("formError");
const successEl = document.getElementById("formSuccess");

const ingredientsWrap = document.getElementById("ingredientsWrap");
const stepsWrap = document.getElementById("stepsWrap");

const addIngredientBtn = document.getElementById("addIngredientBtn");
const addStepBtn = document.getElementById("addStepBtn");

function getTrimmedValue(el) {
  return (el.value || "").trim();
}

function clearMessages() {
  errorEl.textContent = "";
  successEl.textContent = "";
}

/* Renumber labels after adding */
function renumberIngredients() {
  const lines = ingredientsWrap.querySelectorAll(".ingredient-line");
  lines.forEach((line, idx) => {
    const label = line.querySelector(".mini-label");
    if (label) label.textContent = `Ingredient ${idx + 1}:`;
  });
}

function renumberSteps() {
  const lines = stepsWrap.querySelectorAll(".step-line");
  lines.forEach((line, idx) => {
    const label = line.querySelector(".mini-label");
    if (label) label.textContent = `Step ${idx + 1}:`;
  });
}

/* + Add ingredient */
addIngredientBtn.addEventListener("click", () => {
  const idx = ingredientsWrap.querySelectorAll(".ingredient-line").length + 1;

  const line = document.createElement("div");
  line.className = "ingredient-line";
  line.innerHTML = `
    <span class="mini-label">Ingredient ${idx}:</span>
    <label class="inline-label">Name:</label>
    <input class="ing-name" type="text" required />
    <label class="inline-label">Quantity:</label>
    <input class="ing-qty" type="text" required />
  `;
  ingredientsWrap.appendChild(line);
});

/* + Add step */
addStepBtn.addEventListener("click", () => {
  const idx = stepsWrap.querySelectorAll(".step-line").length + 1;

  const line = document.createElement("div");
  line.className = "step-line";
  line.innerHTML = `
    <span class="mini-label">Step ${idx}:</span>
    <input class="step-text" type="text" required />
  `;
  stepsWrap.appendChild(line);
});

/* Validate all required fields except video */
function validateAll() {
  // main required
  const name = getTrimmedValue(document.getElementById("recipeName"));
  const category = document.getElementById("category").value;
  const description = getTrimmedValue(document.getElementById("description"));

  if (!name || !category || !description) return "Please fill all required fields.";

  // photo: allow keeping current photo (so upload is optional)
  // if current photo img is missing AND no new file => error
  const currentPhotoImg = document.getElementById("currentPhotoImg");
  const hasCurrentPhoto = currentPhotoImg && currentPhotoImg.getAttribute("src");
  const photoFile = document.getElementById("photo").files[0];
  if (!hasCurrentPhoto && !photoFile) return "Recipe photo is required.";

  // ingredients
  const ingLines = [...ingredientsWrap.querySelectorAll(".ingredient-line")];
  for (const line of ingLines) {
    const n = line.querySelector(".ing-name");
    const q = line.querySelector(".ing-qty");
    if (!getTrimmedValue(n) || !getTrimmedValue(q)) {
      return "Please fill all ingredient name and quantity fields.";
    }
  }

  // steps
  const stepLines = [...stepsWrap.querySelectorAll(".step-line")];
  for (const line of stepLines) {
    const s = line.querySelector(".step-text");
    if (!getTrimmedValue(s)) return "Please fill all instruction steps.";
  }

  // video optional BUT: if both file and url filled => error
  const videoFile = document.getElementById("videoFile").files[0];
  const videoUrl = getTrimmedValue(document.getElementById("videoUrl"));
  if (videoFile && videoUrl) return "Choose either a video file OR a video URL (not both).";

  return "";
}

form.addEventListener("submit", function (e) {
  e.preventDefault();
  clearMessages();

  // Treat "No video" as empty
  const videoUrlInput = document.getElementById("videoUrl");
  if (getTrimmedValue(videoUrlInput).toLowerCase() === "no video") {
    videoUrlInput.value = "";
  }

  const err = validateAll();
  if (err) {
    errorEl.textContent = err;
    return;
  }
 
  successEl.textContent = "Recipe updated successfully. Redirecting to My Recipes...";
 
  [...form.elements].forEach(el => el.disabled = true);
 
  setTimeout(function () {
    window.location.assign("myRecipe.html");
  }, 1000);
});

document.addEventListener("DOMContentLoaded", function () {
  var logoutBtn = document.getElementById("logoutBtn");

  if (logoutBtn !== null) {
    logoutBtn.onclick = function () {
      window.location.href = "login.html";
    };
  }
});