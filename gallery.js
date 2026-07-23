// ===== Love & Loops Photo Gallery =====
// Reads gallery.json and renders a photo grid with captions.
// To add a new photo: drop the image file into images/gallery/,
// then add one entry to gallery.json with its filename, caption, and date.

(function () {
  const GALLERY_JSON_PATH = "gallery.json";

  async function loadGallery() {
    const grid = document.getElementById("ll-gallery-grid");
    if (!grid) return;

    try {
      const res = await fetch(GALLERY_JSON_PATH + "?v=" + Date.now());
      const photos = await res.json();

      if (!Array.isArray(photos) || photos.length === 0) {
        grid.innerHTML = '<p class="ll-gallery-empty">Photos coming soon!</p>';
        return;
      }

      // Newest first
      photos.sort((a, b) => new Date(b.date) - new Date(a.date));

      grid.innerHTML = photos
        .map(
          (photo, i) => `
        <div class="ll-gallery-card" data-index="${i}">
          <img src="${photo.image}" alt="${escapeHtml(photo.caption)}" loading="lazy">
          <div class="ll-gallery-caption">
            <p>${escapeHtml(photo.caption)}</p>
            ${photo.date ? `<span class="ll-gallery-date">${formatDate(photo.date)}</span>` : ""}
          </div>
        </div>`
        )
        .join("");

      grid.querySelectorAll(".ll-gallery-card").forEach((card) => {
        card.addEventListener("click", () => {
          const photo = photos[card.dataset.index];
          openLightbox(photo);
        });
      });
    } catch (err) {
      grid.innerHTML = '<p class="ll-gallery-empty">Photos coming soon!</p>';
      console.error("Gallery load error:", err);
    }
  }

  function formatDate(dateStr) {
    const d = new Date(dateStr);
    if (isNaN(d)) return "";
    return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str || "";
    return div.innerHTML;
  }

  function openLightbox(photo) {
    let lb = document.getElementById("ll-lightbox");
    if (!lb) {
      lb = document.createElement("div");
      lb.id = "ll-lightbox";
      lb.className = "ll-lightbox";
      lb.innerHTML = `
        <span class="ll-lightbox-close">&times;</span>
        <div class="ll-lightbox-content">
          <img id="ll-lightbox-img" src="" alt="">
          <div class="ll-lightbox-caption" id="ll-lightbox-caption"></div>
        </div>`;
      document.body.appendChild(lb);
      lb.addEventListener("click", (e) => {
        if (e.target === lb || e.target.classList.contains("ll-lightbox-close")) {
          lb.classList.remove("ll-active");
        }
      });
    }
    document.getElementById("ll-lightbox-img").src = photo.image;
    document.getElementById("ll-lightbox-caption").textContent = photo.caption;
    lb.classList.add("ll-active");
  }

  document.addEventListener("DOMContentLoaded", loadGallery);
})();
