document.addEventListener("DOMContentLoaded", function () {
  var allTable = document.querySelector(".recipes-box .table");
  var favTable = document.querySelector(".favourites-box .table");
  var filterRow = document.querySelector(".recipes-box .filter-row");

  if (allTable === null || favTable === null || filterRow === null) {
    return;
  }

  var allTbody = allTable.querySelector("tbody");
  var favTbody = favTable.querySelector("tbody");

  if (allTbody === null || favTbody === null) {
    return;
  }

  var oldInput = filterRow.querySelector('input[type="text"]');
  var filterBtn = filterRow.querySelector("button");

  // ===== Helpers =====
  function getRows() {
    return Array.prototype.slice.call(allTbody.querySelectorAll("tr"));
  }

  function getRowData(row) {
    var tds = row.querySelectorAll("td");

    var name = "";
    var photoSrc = "";
    var creator = "";
    var category = "";
    var likes = "";
    var heartEl = null;

    if (tds.length > 0 && tds[0]) {
      name = tds[0].textContent.trim();
    }

    if (tds.length > 1 && tds[1]) {
      var imgEl = tds[1].querySelector("img");
      if (imgEl) {
        photoSrc = imgEl.getAttribute("src");
      }
    }

    if (tds.length > 2 && tds[2]) {
      creator = tds[2].textContent.trim();
    }

    if (tds.length > 3 && tds[3]) {
      category = tds[3].textContent.trim();
    }

    if (tds.length > 4 && tds[4]) {
      likes = tds[4].textContent.trim();
    }

    if (tds.length > 5 && tds[5]) {
      heartEl = tds[5].querySelector(".heart");
    }

    return {
      row: row,
      name: name,
      photoSrc: photoSrc,
      creator: creator,
      category: category,
      likes: likes,
      heartEl: heartEl
    };
  }

  // ===== LocalStorage favourites =====
  var LS_KEY = "sapori_favourites";
  var favourites = {};

  function loadFavourites() {
    favourites = {};
    var raw = localStorage.getItem(LS_KEY);
    if (raw === null) return;

    try {
      var arr = JSON.parse(raw);
      for (var i = 0; i < arr.length; i++) {
        favourites[arr[i]] = true;
      }
    } catch (e) {
      favourites = {};
    }
  }

  function saveFavourites() {
    var arr = [];
    for (var k in favourites) {
      if (favourites.hasOwnProperty(k) && favourites[k] === true) {
        arr.push(k);
      }
    }
    localStorage.setItem(LS_KEY, JSON.stringify(arr));
  }

  function isFav(name) {
    if (favourites.hasOwnProperty(name) && favourites[name] === true) {
      return true;
    }
    return false;
  }

  function addFav(name) {
    favourites[name] = true;
  }

  function removeFav(name) {
    if (favourites.hasOwnProperty(name)) {
      delete favourites[name];
    }
  }

  // ===== Heart UI =====
  function setHeart(heartEl, active) {
    if (heartEl === null) return;

    if (active === true) {
      heartEl.classList.add("active");
      heartEl.textContent = "♥";
    } else {
      heartEl.classList.remove("active");
      heartEl.textContent = "♡";
    }
  }

  // ===== Render favourites table =====
  function renderFavourites() {
    favTbody.innerHTML = "";

    var rows = getRows();
    var items = [];

    for (var i = 0; i < rows.length; i++) {
      var data = getRowData(rows[i]);
      if (data.name !== "" && isFav(data.name)) {
        items.push(data);
      }
    }

    if (items.length === 0) {
      var trEmpty = document.createElement("tr");
      trEmpty.innerHTML = '<td colspan="3">No favourites yet.</td>';
      favTbody.appendChild(trEmpty);
      return;
    }

    for (var j = 0; j < items.length; j++) {
      (function (item) {
        var tr = document.createElement("tr");

        tr.innerHTML =
          "<td>" + item.name + "</td>" +
          '<td><img src="' + item.photoSrc + '" alt="' + item.name + '"></td>' +
          '<td><a href="#" class="remove-link">Remove</a></td>';

        var removeLink = tr.querySelector(".remove-link");

        removeLink.addEventListener("click", function (e) {
          e.preventDefault();

          removeFav(item.name);
          saveFavourites();

          // update heart in All table
          var allRows = getRows();
          for (var r = 0; r < allRows.length; r++) {
            var d = getRowData(allRows[r]);
            if (d.name === item.name) {
              setHeart(d.heartEl, false);
              break;
            }
          }

          renderFavourites();
        });

        favTbody.appendChild(tr);
      })(items[j]);
    }
  }

  // ===== Attach hearts =====
  function attachHearts() {
    var rows = getRows();

    for (var i = 0; i < rows.length; i++) {
      (function (row) {
        var data = getRowData(row);
        if (data.heartEl === null || data.name === "") return;

        // initial state
        setHeart(data.heartEl, isFav(data.name));
        data.heartEl.style.cursor = "pointer";

        data.heartEl.addEventListener("click", function () {
          if (isFav(data.name)) {
            removeFav(data.name);
            setHeart(data.heartEl, false);
          } else {
            addFav(data.name);
            setHeart(data.heartEl, true);
          }

          saveFavourites();
          renderFavourites();
        });
      })(rows[i]);
    }
  }

  // ===== Filter dropdown (ONLY works when pressing Filter button) =====
  function buildCategoryFilter() {
    // hide search input (we don't use it)
    if (oldInput !== null) {
      oldInput.style.display = "none";
    }

    // collect categories
    var rows = getRows();
    var catsMap = {};

    for (var i = 0; i < rows.length; i++) {
      var data = getRowData(rows[i]);
      if (data.category !== "") {
        catsMap[data.category] = true;
      }
    }

    var categories = [];
    for (var c in catsMap) {
      if (catsMap.hasOwnProperty(c)) {
        categories.push(c);
      }
    }

    // create select
    var select = document.createElement("select");
    select.className = "category-select";

    var optAll = document.createElement("option");
    optAll.value = "All";
    optAll.textContent = "All";
    select.appendChild(optAll);

    for (var j = 0; j < categories.length; j++) {
      var opt = document.createElement("option");
      opt.value = categories[j];
      opt.textContent = categories[j];
      select.appendChild(opt);
    }

    // insert select before filter button
    if (filterBtn !== null) {
      filterRow.insertBefore(select, filterBtn);
    } else {
      filterRow.appendChild(select);
    }

    // apply filter (button only)
    function applyFilter() {
      var chosen = select.value;
      var rows2 = getRows();

      for (var k = 0; k < rows2.length; k++) {
        var d = getRowData(rows2[k]);

        if (chosen === "All") {
          rows2[k].style.display = "";
        } else {
          if (d.category === chosen) {
            rows2[k].style.display = "";
          } else {
            rows2[k].style.display = "none";
          }
        }
      }
    }

    // filter only when user clicks the button
    if (filterBtn !== null) {
      filterBtn.addEventListener("click", applyFilter);
    }
  }

  // ===== Run =====
  loadFavourites();
  buildCategoryFilter();
  attachHearts();
  renderFavourites();
});
document.addEventListener("DOMContentLoaded", function () {
  var logoutBtn = document.getElementById("logoutBtn");

  if (logoutBtn !== null) {
    logoutBtn.onclick = function () {
      window.location.href = "login.html";
    };
  }
});
