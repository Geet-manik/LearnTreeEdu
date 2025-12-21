// Load JSON ----------------------------------------------------

async function fetchContent() {
  const response = await fetch("assets/data/content.json");
  if (!response.ok) throw new Error("Unable to load content.json");
  return response.json();
}

// Small helpers ------------------------------------------------

function $(selector, scope = document) {
  return scope.querySelector(selector);
}

function $all(selector, scope = document) {
  return Array.from(scope.querySelectorAll(selector));
}

// Render functions ----------------------------------------------

function renderSiteMeta(site) {
  $("#brand-name").textContent = site.name;
  $("#brand-tagline").textContent = site.tagline;
  $("#hero-title").textContent = site.heroTitle;
  $("#hero-subtitle").textContent = site.heroSubtitle;

  const heroHighlightsEl = $("#hero-highlights");
  heroHighlightsEl.innerHTML = "";
  (site.heroHighlights || []).forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    heroHighlightsEl.appendChild(li);
  });

  const navLinksEl = $("#nav-links");
  navLinksEl.innerHTML = "";
  (site.navItems || []).forEach((nav) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.textContent = nav.label;
  
    if (nav.external && nav.url) {
      a.href = nav.url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
    } else {
      a.href = `#${nav.target}`;
      a.addEventListener("click", () => closeMobileNav());
    }
  
    li.appendChild(a);
    navLinksEl.appendChild(li);
  });
  
}

function renderAbout(about) {
  $("#about-subtitle").textContent = about.subtitle;

  const aboutTextEl = $("#about-text");
  aboutTextEl.innerHTML = "";
  (about.paragraphs || []).forEach((p) => {
    const para = document.createElement("p");
    para.textContent = p;
    aboutTextEl.appendChild(para);
  });

  $("#author-name").textContent = about.author.name;
  $("#author-role").textContent = about.author.role;
  $("#author-note").textContent = about.author.note;

  const contactList = $("#contact-list");
  contactList.innerHTML = "";
  (about.author.contacts || []).forEach((item) => {
    const li = document.createElement("li");
    li.textContent = `${item.type}: ${item.value}`;
    contactList.appendChild(li);
  });
}

function renderWorkshops(workshops) {
  $("#workshops-subtitle").textContent = workshops.subtitle;
  const listEl = $("#workshops-list");
  listEl.innerHTML = "";

  (workshops.items || []).forEach((ws) => {
    const card = document.createElement("article");
    card.className = "card workshop-card reveal";
    if (ws.image) {
      const img = document.createElement("img");
      img.src = ws.image;
      img.alt = ws.title;
      img.className = "workshop-image";
    
      // 🔥 CLICK TO EXPAND
      img.style.cursor = "zoom-in";
      img.addEventListener("click", () => {
        openLightbox(ws.image, ws.title);
      });
    
      card.appendChild(img);
    }
    

    const h3 = document.createElement("h3");
    h3.textContent = ws.title;
    card.appendChild(h3);


    const meta = document.createElement("div");
    meta.className = "workshop-meta";
    const dateSpan = document.createElement("span");
    dateSpan.textContent = ws.dateLabel;
    const locSpan = document.createElement("span");
    locSpan.textContent = ws.location;
    meta.appendChild(dateSpan);
    meta.appendChild(locSpan);
    card.appendChild(meta);

    const tagsWrap = document.createElement("div");
    tagsWrap.className = "workshop-tags";

    (ws.tags || []).forEach((tag) => {
      const chip = document.createElement("span");
      chip.className = "chip";
      chip.textContent = tag;
      tagsWrap.appendChild(chip);
    });

    card.appendChild(tagsWrap);

    listEl.appendChild(card);
  });
}
function setupFlipbook(flipbook) {
  if (!flipbook) return;

  const imgEl = document.getElementById("flipbook-page");
  const overlay = document.getElementById("flipbook-overlay");
  const prevBtn = document.getElementById("flip-prev");
  const nextBtn = document.getElementById("flip-next");

  const amazonBtn = document.getElementById("flip-buy-amazon");
  const waBtn = document.getElementById("flip-buy-whatsapp");

  let index = 0;
  const pages = flipbook.pages;
  const limit = flipbook.previewLimit;
  const pdfBtn = document.getElementById("flip-download-pdf");

  function render() {
    imgEl.src = pages[index];

    if (index >= limit - 1) {
      overlay.classList.remove("hidden");
    } else {
      overlay.classList.add("hidden");
    }
  }

  prevBtn.onclick = () => {
    if (index > 0) {
      index--;
      render();
    }
  };

  nextBtn.onclick = () => {
    if (index < pages.length - 1) {
      index++;
      render();
    }
  };

  amazonBtn.href = flipbook.buyAmazon;
  waBtn.href =
    `https://wa.me/${flipbook.whatsappNumber}?text=` +
    encodeURIComponent(
      `Hi, I want to buy "${flipbook.title}". Please share payment details. (Available discounts with free shipping)`
    );
    if (flipbook.pdfDownload) {
      pdfBtn.href = flipbook.pdfDownload.url;
      pdfBtn.textContent = flipbook.pdfDownload.label || "Download PDF";
    } else {
      pdfBtn.style.display = "none";
    }
    
  render();
}
function setupActiveNav() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-links a");

  function onScroll() {
    let scrollPos = window.scrollY + 120;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute("id");

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach((link) => link.classList.remove("active"));
        const activeLink = document.querySelector(
          `.nav-links a[href="#${id}"]`
        );
        if (activeLink) activeLink.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", onScroll);
  onScroll(); // run once on load
}

function renderBooks(books) {
  $("#books-subtitle").textContent = books.subtitle;
  const listEl = $("#books-list");
  listEl.innerHTML = "";

  (books.items || []).forEach((book) => {
    const card = document.createElement("article");
    card.className = "card book-card reveal";

    // Cover
    const coverWrap = document.createElement("div");
    coverWrap.className = "book-cover-wrap";

    const img = document.createElement("img");
    img.src = book.coverImage;
    img.alt = book.title;
    img.className = "book-cover";
    coverWrap.appendChild(img);

    if (book.questionCount) {
      const badge = document.createElement("span");
      badge.className = "badge";
      badge.textContent = `${book.questionCount} Questions`;
      coverWrap.appendChild(badge);
    }

    card.appendChild(coverWrap);

    // Info
    const info = document.createElement("div");
    info.className = "book-info";

    const h3 = document.createElement("h3");
    h3.textContent = book.title;
    info.appendChild(h3);

    const metaP = document.createElement("p");
    metaP.textContent = `${book.edition} • ${book.class}`;
    info.appendChild(metaP);

    const metaRow = document.createElement("div");
    metaRow.className = "book-meta-row";

    if (book.price) {
      const priceChip = document.createElement("span");
      priceChip.className = "book-meta-item";
      priceChip.textContent = `${book.currency} ₹${book.price}`;
      metaRow.appendChild(priceChip);
    }

    (book.suitableFor || []).slice(0, 3).forEach((item) => {
      const chip = document.createElement("span");
      chip.className = "book-meta-item";
      chip.textContent = item;
      metaRow.appendChild(chip);
    });

    info.appendChild(metaRow);
    card.appendChild(info);

//     // Actions
//     const actions = document.createElement("div");
//     actions.className = "book-actions";

//     const detailsBtn = document.createElement("button");
//     detailsBtn.className = "btn btn-outline btn-sm";
//     detailsBtn.textContent = "View details";
//     detailsBtn.addEventListener("click", () => openBookModal(book));
//     actions.appendChild(detailsBtn);

//     const buyLink = document.createElement("a");
//     buyLink.className = "btn btn-primary btn-sm";
//     buyLink.href = book.buyUrl;
//     buyLink.target = "_blank";
//     buyLink.rel = "noopener noreferrer";
//     buyLink.textContent = book.ctaText || "Buy online";
//     actions.appendChild(buyLink);
// // WhatsApp Buy Button
//     if (book.whatsappNumber) {
//       const waBtn = document.createElement("a");
//       waBtn.className = "btn btn-success btn-sm"; 
//       waBtn.href =
//       waBtn.href =
//       `https://wa.me/${book.whatsappNumber}?text=` +
//       encodeURIComponent(
//         `Hi, I want to buy the book "${book.title}". Please share payment details.`
//       );
//       waBtn.target = "_blank";
//       waBtn.rel = "noopener noreferrer";
//       waBtn.textContent = "Buy from us";
//       actions.appendChild(waBtn);
//     }

//     card.appendChild(actions);
//     // Actions
const actions = document.createElement("div");
actions.className = "book-actions";
    const detailsBtn = document.createElement("button");
    detailsBtn.className = "btn btn-outline btn-sm";
    detailsBtn.textContent = "View details";
    detailsBtn.addEventListener("click", () => openBookModal(book));
    actions.appendChild(detailsBtn);
(book.buyOptions || []).forEach((opt) => {
  const btn = document.createElement("a");
  btn.className = `btn btn-${opt.style || "outline"} btn-sm`;

  if (opt.type === "external") {
    btn.href = opt.url;
    btn.target = "_blank";
    btn.rel = "noopener noreferrer";
  }

  if (opt.type === "whatsapp") {
    btn.href =
      `https://wa.me/${opt.number}?text=` +
      encodeURIComponent(opt.message || `Hi, I want to buy "${book.title}".`);
    btn.target = "_blank";
    btn.rel = "noopener noreferrer";
  }

  btn.textContent = opt.label;
  actions.appendChild(btn);
});

card.appendChild(actions);

    listEl.appendChild(card);

    // Use first book for hero
    if (book.id === "bst12-otq") {
      $("#hero-book-cover").src = book.coverImage;
      $("#hero-book-title").textContent = book.title;
      $("#hero-book-meta").textContent = `${book.edition} • ${book.class}`;
      $("#hero-book-cta").onclick = () => openBookModal(book);
    }
  });
}

// Testimonials --------------------------------------------------

// render both groups; actual grid logic lives in setupTestimonialGrid()
function renderTestimonials(testimonials) {
  // Books testimonials
  $("#testimonials-books-title").textContent = testimonials.booksTitle;
  $("#testimonials-books-subtitle").textContent = testimonials.booksSubtitle;

  const booksTrack = $("#testimonial-track-books");
  setupTestimonialGrid(
    booksTrack,
    $("#slider-books-prev"),
    $("#slider-books-next"),
    testimonials.booksItems || []
  );

  // OTQ testimonials
  $("#testimonials-otq-title").textContent = testimonials.otqTitle;
  $("#testimonials-otq-subtitle").textContent = testimonials.otqSubtitle;

  const otqTrack = $("#testimonial-track-otq");
  setupTestimonialGrid(
    otqTrack,
    $("#slider-otq-prev"),
    $("#slider-otq-next"),
    testimonials.otqItems || []
  );
}

// function renderGallery(gallery) {
//   $("#gallery-subtitle").textContent = gallery.subtitle;
//   const grid = $("#gallery-grid");
//   grid.innerHTML = "";

//   (gallery.items || []).forEach((item) => {
//     const tile = document.createElement("article");
//     tile.className = "gallery-item reveal";

//     const img = document.createElement("img");
//     img.src = item.image;
//     img.alt = item.title;

//     const overlay = document.createElement("div");
//     overlay.className = "gallery-item-overlay";

//     const title = document.createElement("div");
//     title.className = "gallery-item-title";
//     title.textContent = item.title;

//     const caption = document.createElement("div");
//     caption.className = "gallery-item-caption";
//     caption.textContent = item.caption;

//     overlay.appendChild(title);
//     overlay.appendChild(caption);

//     tile.appendChild(img);
//     tile.appendChild(overlay);

//     tile.addEventListener("click", () => openLightbox(item.image, item.caption));

//     grid.appendChild(tile);
//   });
// }

function renderLinks(links) {
  $("#links-subtitle").textContent = links.subtitle;
  const grid = $("#links-grid");
  grid.innerHTML = "";

  (links.items || []).forEach((link) => {
    const card = document.createElement("article");
    card.className = "link-card reveal";

    const type = document.createElement("div");
    type.className = "link-card-type";
    type.textContent = link.type;
    card.appendChild(type);

    const anchor = document.createElement("a");
    anchor.href = link.url;
    anchor.target = link.url.startsWith("http") ? "_blank" : "_self";
    anchor.rel = "noopener noreferrer";
    anchor.textContent = link.label;
    card.appendChild(anchor);

    grid.appendChild(card);
  });
}

function renderFooter(site, footer) {
  $("#footer-name").textContent = site.name;
  $("#footer-name-inline").textContent = site.name;
  $("#footer-address").textContent = footer.address;
  $("#footer-contact").textContent = `Phone: ${footer.phone}`;
  $("#footer-email").textContent = `Email: ${footer.email}`;
  $("#year").textContent = new Date().getFullYear();
}

// Modals -------------------------------------------------------

function openBookModal(book) {
  const modal = $("#book-modal");
  const content = $("#book-modal-content");
  content.innerHTML = "";

  const title = document.createElement("h2");
  title.id = "book-modal-title";
  title.textContent = book.title;
  content.appendChild(title);

  const subtitle = document.createElement("p");
  subtitle.className = "section-subtitle";
  subtitle.textContent = `${book.edition} • ${book.class}`;
  content.appendChild(subtitle);

  const layout = document.createElement("div");
  layout.className = "book-modal-layout";

  // Left column: images
  const imagesCol = document.createElement("div");

  const coverImg = document.createElement("img");
  coverImg.src = book.coverImage;
  coverImg.alt = `${book.title} cover`;
  imagesCol.appendChild(coverImg);

  if (book.backImage) {
    const backImg = document.createElement("img");
    backImg.src = book.backImage;
    backImg.alt = `${book.title} back cover`;
    backImg.style.marginTop = "0.7rem";
    imagesCol.appendChild(backImg);
  }

  layout.appendChild(imagesCol);

  // Right column: description
  const detailsCol = document.createElement("div");

  const descHeading = document.createElement("h3");
  descHeading.className = "book-modal-section-title";
  descHeading.textContent = book.descriptionHeading;
  detailsCol.appendChild(descHeading);

  (book.description || []).forEach((para) => {
    const p = document.createElement("p");
    p.textContent = para;
    detailsCol.appendChild(p);
  });
  if (book.features && book.features.length) {
    const ul = document.createElement("ul");
    book.features.forEach((f) => {
      const li = document.createElement("li");
    
      if (typeof f === "string") {
        li.textContent = f;
      } else {
        li.innerHTML = `<strong>${f.title}:</strong> ${f.text}`;
      }
    
      ul.appendChild(li);
    });
  
  
    detailsCol.appendChild(ul);
  }
  if (book.bullets && book.bullets.length) {
    const bulletsHeading = document.createElement("h3");
    bulletsHeading.className = "book-modal-section-title";
    bulletsHeading.textContent = "Why this book works";
    detailsCol.appendChild(bulletsHeading);

    const ul = document.createElement("ul");
    book.bullets.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      ul.appendChild(li);
    });
    detailsCol.appendChild(ul);
  }


  

  if (book.contributors && book.contributors.length) {
    const contribHeading = document.createElement("h3");
    contribHeading.className = "book-modal-section-title";
    contribHeading.textContent = book.contributorsHeading || "Contributors";
    detailsCol.appendChild(contribHeading);

    const ul = document.createElement("ul");
    book.contributors.forEach((c) => {
      const li = document.createElement("li");
      li.textContent = c;
      ul.appendChild(li);
    });
    detailsCol.appendChild(ul);
  }


// const ctaRow = document.createElement("div");
// ctaRow.className = "book-modal-actions";   

// const buyBtn = document.createElement("a");
// buyBtn.href = book.buyUrl;
// buyBtn.target = "_blank";
// buyBtn.rel = "noopener noreferrer";
// buyBtn.className = "btn btn-primary";
// buyBtn.textContent = book.ctaText || "Buy on Amazon";
// ctaRow.appendChild(buyBtn);


// if (book.whatsappNumber) {
//   const waBtn = document.createElement("a");
//   waBtn.className = "btn btn-success"; 
//   waBtn.href =
//     `https://wa.me/${book.whatsappNumber}?text=` +
//     encodeURIComponent(
//       `Hi, I want to buy the book "${book.title}". Please share payment details.`
//     );
//   waBtn.target = "_blank";
//   waBtn.rel = "noopener noreferrer";
//   waBtn.textContent = "Buy from us";
//   ctaRow.appendChild(waBtn);
// }

// detailsCol.appendChild(ctaRow);

const ctaRow = document.createElement("div");
ctaRow.className = "book-modal-actions";

(book.buyOptions || []).forEach((opt) => {
  const btn = document.createElement("a");
  btn.className = `btn btn-${opt.style || "outline"}`;

  if (opt.type === "external") {
    btn.href = opt.url;
    btn.target = "_blank";
    btn.rel = "noopener noreferrer";
  }

  if (opt.type === "whatsapp") {
    btn.href =
      `https://wa.me/${opt.number}?text=` +
      encodeURIComponent(`Hi, I want to buy "${book.title}".Please share payment details`);
    btn.target = "_blank";
    btn.rel = "noopener noreferrer";
  }

  btn.textContent = opt.label;
  ctaRow.appendChild(btn);
});

detailsCol.appendChild(ctaRow);


  layout.appendChild(detailsCol);
  content.appendChild(layout);

  openModal(modal);
}

function openLightbox(src, caption) {
  const modal = $("#lightbox-modal");
  $("#lightbox-image").src = src;
  $("#lightbox-caption").textContent = caption || "";
  openModal(modal);
}

function openModal(modal) {
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
}

function closeModal(modal) {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
}

// Testimonial grid slider --------------------------------------
function getTestimonialsPerPage() {
  const w = window.innerWidth;

  if (w >= 1024) return 6;   // Desktop
  if (w >= 768) return 4;    // Tablet
  return 1;                 // Mobile
}

// Shows 6 testimonials at a time, then next/prev for next 6
function setupTestimonialGrid(track, prevBtn, nextBtn, items) {
  if (!track) return;

  let perPage = getTestimonialsPerPage();
  let page = 0;

  function renderPage() {
    track.innerHTML = "";

    const start = page * perPage;
    const slice = items.slice(start, start + perPage);

    slice.forEach((t) => {
      const card = document.createElement("article");
      card.className = "testimonial-card";

      card.innerHTML = `
        <p class="testimonial-message">“${t.message}”</p>
        <div class="testimonial-author">
          <strong>${t.name}</strong>
          <span>${t.role}</span>
        </div>
      `;

      track.appendChild(card);
    });
  }

  renderPage();

  const totalPages = () => Math.ceil(items.length / perPage);

  prevBtn.onclick = () => {
    page = (page - 1 + totalPages()) % totalPages();
    renderPage();
  };

  nextBtn.onclick = () => {
    page = (page + 1) % totalPages();
    renderPage();
  };

  window.addEventListener("resize", () => {
    const newPerPage = getTestimonialsPerPage();
    if (newPerPage !== perPage) {
      perPage = newPerPage;
      page = 0;
      renderPage();
    }
  });
}


// Scroll reveal ------------------------------------------------

function setupRevealOnScroll() {
  const elements = $all(".reveal");
  if (!("IntersectionObserver" in window) || elements.length === 0) {
    elements.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  elements.forEach((el) => observer.observe(el));
}

// Navigation / mobile menu ------------------------------------

function setupNavToggle() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".main-nav");

  toggle.addEventListener("click", () => {
    nav.classList.toggle("is-open");
  });
}

function closeMobileNav() {
  const nav = document.querySelector(".main-nav");
  nav.classList.remove("is-open");
}

// Modal close bindings ----------------------------------------

function setupModalClosers() {
  $all("[data-modal-close]").forEach((el) => {
    el.addEventListener("click", () => {
      const modal = el.closest(".modal");
      if (modal) closeModal(modal);
    });
  });

  $all(".modal").forEach((modal) => {
    modal.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeModal(modal);
    });
  });
}
function renderPapers(papers) {
  if (!papers) return;

  $("#papers-title").textContent = papers.title;
  $("#papers-subtitle").textContent = papers.subtitle;

  const grid = $("#papers-grid");
  grid.innerHTML = "";

  (papers.items || []).forEach((item) => {
    const card = document.createElement("article");
    card.className = "card paper-card reveal";

    const category = document.createElement("h3");
    category.textContent = item.category;
    card.appendChild(category);

    const subject = document.createElement("p");
    subject.className = "paper-subject";
    subject.textContent = item.subject;
    card.appendChild(subject);

    const desc = document.createElement("p");
    desc.textContent = item.description;
    card.appendChild(desc);

    const meta = document.createElement("div");
    meta.className = "paper-meta";
    meta.innerHTML = `
      <span>${item.year}</span>
      <span>${item.type}</span>
    `;
    card.appendChild(meta);

    const link = document.createElement("a");
    link.href = item.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.className = "btn btn-outline btn-sm";
    link.textContent = "View Papers";
    card.appendChild(link);

    grid.appendChild(card);
  });
}


// Init --------------------------------------------------------

async function init() {
  try {
    const data = await fetchContent();

    renderSiteMeta(data.site);
    // renderAbout(data.about);
    renderWorkshops(data.workshops);
    renderBooks(data.books);
    renderTestimonials(data.testimonials);
    setupFlipbook(data.flipbooks);
    setupActiveNav();
    // renderGallery(data.gallery);
    renderLinks(data.links);
    renderFooter(data.site, data.footer);
    renderPapers(data.papers);

    setupNavToggle();
    setupModalClosers();
    setupRevealOnScroll();
  } catch (err) {
    console.error(err);
    alert("There was a problem loading the website content. Please try again.");
  }
}

document.addEventListener("DOMContentLoaded", init);
