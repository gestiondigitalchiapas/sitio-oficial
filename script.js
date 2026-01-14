// ================================
// CONFIGURACIÓN Y CONSTANTES
// ================================

const CONFIG = {
  SPLASH_DURATION: 2500, // milisegundos
  POSTS_PER_PAGE: 9,
  ANIMATION_DELAY: 100, // delay entre animaciones de cards
};

// ================================
// BASE DE DATOS SIMULADA (V1)
// ================================
// En V1, los posts se almacenan directamente aquí
// En V2, esto se reemplazará por Supabase

let postsDatabase = [
  // EJEMPLO DE POST - Estructura completa
  // {
  //     id: 1,
  //     title: "Título de la publicación",
  //     description: "Descripción breve del contenido...",
  //     image: "url-de-imagen.jpg",
  //     url: "https://facebook.com/post/123",
  //     type: "facebook", // facebook, instagram, youtube, tiktok, link
  //     date: "2025-01-15",
  //     featured: false,
  //     visible: true
  // }
];

// ================================
// FUNCIÓN PARA AGREGAR POSTS MANUALMENTE (V1)
// ================================
// Esta función la usarás para agregar posts rápidamente

function addPost(postData) {
  const post = {
    id: Date.now(),
    title: postData.title || "Sin título",
    description: postData.description || "",
    image: postData.image || "",
    url: postData.url || "#",
    embedCode: postData.embedCode || "", // Soporte para iframe embed
    type: postData.type || detectSocialNetwork(postData.url),
    category: postData.category || "movimiento", // "movimiento" o "medios"
    mediaSource: postData.mediaSource || "", // Nombre del medio (ej: "El Heraldo")
    date: postData.date || new Date().toISOString().split("T")[0],
    featured: postData.featured || false,
    pinned: postData.pinned || false, // NUEVO: Post fijo
    visible: postData.visible !== false, // true por defecto
  };

  // Si es pinned, agregar al inicio; si no, después de los pinned
  if (post.pinned) {
    // Encontrar el último post pinned
    const lastPinnedIndex = postsDatabase.findIndex((p) => !p.pinned);
    if (lastPinnedIndex === -1) {
      postsDatabase.push(post); // Todos son pinned o está vacío
    } else {
      postsDatabase.splice(lastPinnedIndex, 0, post); // Insertar antes del primer no-pinned
    }
  } else {
    postsDatabase.push(post); // Agregar al final
  }

  return post;
}

// Detectar red social desde URL
function detectSocialNetwork(url) {
  if (!url) return "link";
  if (url.includes("facebook.com") || url.includes("fb.com")) return "facebook";
  if (url.includes("instagram.com")) return "instagram";
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
  if (url.includes("tiktok.com")) return "tiktok";
  if (url.includes("twitter.com") || url.includes("x.com")) return "twitter";
  return "link";
}

// ================================
// POSTS FIJOS INICIALES
// ================================
// Estos posts siempre aparecerán primero

// IMPORTANTE: Los posts fijos NO tienen fecha aquí
// La fecha se agrega automáticamente al inicializar (fecha actual del navegador)

const pinnedPosts = [
  {
    title: "Sígueme en Facebook - Jovani Salazar",
    description: "Mantente al día con mis actividades",
    image:
      "https://diariodechiapas.com/wp-content/uploads/2024/02/DIME_12A-1-1.jpg",
    url: "https://www.facebook.com/AlexanderJovaniSalazar",
    type: "facebook",
    category: "movimiento",
    featured: true,
    pinned: true, // POST FIJO
    visible: true,
    // NO tiene 'date' - se asigna automáticamente con fecha actual
  },
  {
    title: "Página Oficial del Movimiento",
    description:
      "Síguenos para noticias y eventos del Movimiento de Esperanza y Humanismo",
    image:
      "https://edudevsys.github.io/lamejoropcionparatuxtla/assets/images/logoM4T.jpg",
    url: "https://www.facebook.com/profile.php?id=100088311252002",
    type: "facebook",
    category: "movimiento",
    featured: true,
    pinned: true, // POST FIJO
    visible: true,
    // NO tiene 'date' - se asigna automáticamente con fecha actual
  },
];

// ================================
// CARGAR POSTS DESDE SUPABASE
// ================================

async function loadPostsFromSupabase() {
  try {
    console.log("📡 Cargando posts desde Supabase...");

    // Primero agregar posts fijos
    pinnedPosts.forEach((post) => addPost(post));

    // Verificar si el cliente de Supabase está disponible
    if (!supabaseClient) {
      console.warn("⚠️ Cliente de Supabase no está disponible.");
      console.log(
        "💡 Verifica que supabase-config.js esté cargado correctamente"
      );
      return;
    }

    console.log("🔍 Intentando conectar a Supabase...");

    // Obtener posts desde Supabase
    const { data: posts, error } = await supabaseClient
      .from("posts")
      .select("*")
      .eq("visible", true)
      .order("date", { ascending: false });

    if (error) {
      console.error("❌ Error al cargar posts:", error);
      console.log('💡 Verifica que la tabla "posts" exista en Supabase');
      return;
    }

    if (!posts || posts.length === 0) {
      console.log("📭 No hay posts en Supabase aún");
      console.log("💡 Agrega posts en Supabase Table Editor");
      return;
    }

    // Agregar cada post de Supabase
    posts.forEach((post) => {
      addPost({
        title: post.title,
        description: post.description,
        image: post.image,
        url: post.url,
        type: post.type || "facebook",
        category: post.category || "movimiento",
        mediaSource: post.mediaSource,
        featured: post.featured || false,
        date: post.date,
        visible: post.visible !== false,
      });
    });

    console.log(`✅ ${posts.length} posts cargados desde Supabase`);
  } catch (error) {
    console.error("❌ Error al conectar con Supabase:", error);
    console.log("💡 Detalles:", error.message);
  }
}

// Inicializar posts (se llama después del splash screen)

// ================================
// POSTS DE EJEMPLO (OPCIONAL)
// ================================
// Puedes agregar más posts de ejemplo aquí si quieres

const examplePosts = [
  {
    title: "Primera Reunión Comunitaria Exitosa",
    description:
      "Gran participación en la primera reunión del Movimiento de Esperanza y Humanismo. Jovani Salazar agradeció la participación de todos los asistentes.",
    image:
      "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=600&h=400&fit=crop",
    url: "https://www.facebook.com/profile.php?id=100088311252002",
    type: "facebook",
    date: "2025-01-12",
    visible: true,
  },
  {
    title: "Proyectos de Desarrollo Social",
    description:
      "Jovani Salazar detalla las primeras iniciativas del Movimiento de Esperanza y Humanismo para fortalecer nuestra comunidad.",
    image:
      "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&h=400&fit=crop",
    url: "https://www.facebook.com/profile.php?id=100088311252002",
    type: "facebook",
    date: "2025-01-10",
    visible: true,
  },
];

// Agregar posts de ejemplo
//examplePosts.forEach((post) => addPost(post));

// ================================
// SISTEMA DE SPLASH SCREEN
// ================================

function initSplashScreen() {
  const splash = document.getElementById("splash-screen");
  const mainContent = document.getElementById("main-content");

  setTimeout(async () => {
    splash.style.display = "none";
    mainContent.style.display = "block";

    // Trigger animaciones de entrada
    document.body.classList.add("loaded");

    // Cargar posts desde Supabase después del splash
    await loadPostsFromSupabase();
    loadPosts();
  }, CONFIG.SPLASH_DURATION);
}

// ================================
// GESTIÓN DEL FEED DE POSTS
// ================================

let currentPage = 1;
let postsLoaded = 0;

function loadPosts(page = 1) {
  const feedContainer = document.getElementById("posts-feed");
  const loadMoreBtn = document.getElementById("load-more-btn");

  // Filtrar solo posts visibles y ordenar: pinned primero, luego por fecha descendente
  const visiblePosts = postsDatabase
    .filter((post) => post.visible)
    .sort((a, b) => {
      // Primero ordenar por pinned
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      // Luego por fecha descendente
      return new Date(b.date) - new Date(a.date);
    });

  const startIndex = (page - 1) * CONFIG.POSTS_PER_PAGE;
  const endIndex = startIndex + CONFIG.POSTS_PER_PAGE;
  const postsToShow = visiblePosts.slice(startIndex, endIndex);

  // Si es la primera página, limpiar el container
  if (page === 1) {
    feedContainer.innerHTML = "";
    postsLoaded = 0;
  }

  // Si no hay posts
  if (postsToShow.length === 0 && page === 1) {
    feedContainer.innerHTML = `
            <div class="no-posts">
                <span style="font-size: 4rem;">🐇</span>
                <h3>Aún no hay publicaciones</h3>
                <p>Las últimas noticias del movimiento aparecerán aquí próximamente.</p>
            </div>
        `;
    loadMoreBtn.style.display = "none";
    return;
  }

  // Renderizar posts
  postsToShow.forEach((post, index) => {
    const postCard = createPostCard(post, postsLoaded + index);
    feedContainer.appendChild(postCard);
  });

  postsLoaded += postsToShow.length;

  // Mostrar/ocultar botón "Cargar más"
  if (endIndex < visiblePosts.length) {
    loadMoreBtn.style.display = "inline-flex";
  } else {
    loadMoreBtn.style.display = "none";
  }
}

function createPostCard(post, index) {
  const card = document.createElement("div");
  card.className = "post-card";
  card.style.animationDelay = `${index * CONFIG.ANIMATION_DELAY}ms`;

  // Icono de red social
  const socialIcon = getSocialIcon(post.type);

  // Badge de destacado, cobertura de medios, o fijado
  let specialBadge = "";
  if (post.pinned) {
    specialBadge = '<span class="post-badge pinned">📌 Fijado</span>';
  } else if (post.featured) {
    specialBadge = '<span class="post-badge featured">⭐ Destacado</span>';
  } else if (post.category === "medios" && post.mediaSource) {
    specialBadge = `<span class="post-badge media">📰 ${post.mediaSource}</span>`;
  }

  // Fecha formateada
  const formattedDate = formatDate(post.date);

  // Si tiene embedCode (iframe), usarlo en lugar de imagen
  const contentMedia = post.embedCode
    ? `<div class="post-embed">${post.embedCode}</div>`
    : post.image
    ? `<img src="${post.image}" alt="${post.title}" class="post-image" loading="lazy">`
    : "";

  card.innerHTML = `
        ${contentMedia}
        <div class="post-content">
            <div class="post-header">
                <span class="post-date">${formattedDate}</span>
                ${specialBadge}
            </div>
            <h3 class="post-title">${post.title}</h3>
            ${
              post.description
                ? `<p class="post-description">${post.description}</p>`
                : ""
            }
            <div class="post-footer">
                <span class="social-badge">
                    ${socialIcon}
                    ${
                      post.category === "medios"
                        ? "Cobertura"
                        : capitalizeFirst(post.type)
                    }
                </span>
                ${
                  post.category === "medios" && post.image
                    ? `<button class="post-link view-screenshot" data-image="${post.image}">Ver captura completa</button>`
                    : `<a href="${
                        post.url
                      }" target="_blank" rel="noopener noreferrer" class="post-link">
                        ${
                          post.category === "medios"
                            ? "Ver página →"
                            : "Ver publicación →"
                        }
                    </a>`
                }
            </div>
        </div>
    `;

  // Click en la tarjeta abre el link (excepto si es un embed)
  if (!post.embedCode) {
    card.addEventListener("click", (e) => {
      if (!e.target.closest(".post-link")) {
        window.open(post.url, "_blank", "noopener,noreferrer");
      }
    });
  }

  return card;
}

// ================================
// UTILIDADES
// ================================

function getSocialIcon(type) {
  const icons = {
    facebook:
      '<svg class="social-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>',
    instagram:
      '<svg class="social-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>',
    youtube:
      '<svg class="social-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>',
    tiktok:
      '<svg class="social-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>',
    twitter:
      '<svg class="social-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
    link: '<svg class="social-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" fill="none"/></svg>',
  };

  return icons[type] || icons.link;
}

function formatDate(dateString) {
  // Dividir la fecha en partes (YYYY-MM-DD)
  const [year, month, day] = dateString.split("-");

  // Crear fecha directamente sin zona horaria (evita el problema de UTC)
  const date = new Date(year, month - 1, day);

  const options = { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString("es-MX", options);
}

function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ================================
// NAVEGACIÓN SUAVE
// ================================

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));

      if (target) {
        // Actualizar nav activo
        document.querySelectorAll(".nav-link").forEach((link) => {
          link.classList.remove("active");
        });
        this.classList.add("active");

        // Scroll suave
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
}

// ================================
// SCROLL SPY (DETECTAR SECCIÓN ACTIVA)
// ================================

function initScrollSpy() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  window.addEventListener("scroll", () => {
    let current = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;

      if (window.pageYOffset >= sectionTop - 200) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  });
}

// ================================
// BOTÓN "CARGAR MÁS"
// ================================

function initLoadMore() {
  const loadMoreBtn = document.getElementById("load-more-btn");

  loadMoreBtn.addEventListener("click", () => {
    currentPage++;
    loadPosts(currentPage);
  });
}

// ================================
// INICIALIZACIÓN
// ================================

document.addEventListener("DOMContentLoaded", () => {
  initSplashScreen();
  initSmoothScroll();
  initScrollSpy();
  initLoadMore();
  initLightbox();
  initMobileMenu();
});

// ================================
// MENÚ MÓVIL
// ================================

function initMobileMenu() {
  const menuToggle = document.getElementById("mobile-menu-toggle");
  const mainNav = document.getElementById("main-nav");
  const navLinks = document.querySelectorAll(".nav-link");

  if (!menuToggle || !mainNav) return;

  // Toggle del menú
  menuToggle.addEventListener("click", (e) => {
    e.stopPropagation(); // Evitar que se propague
    menuToggle.classList.toggle("active");
    mainNav.classList.toggle("active");
    document.body.classList.toggle("menu-open");
  });

  // Cerrar menú al hacer click en un link
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      // No prevenir default - dejar que navegue
      menuToggle.classList.remove("active");
      mainNav.classList.remove("active");
      document.body.classList.remove("menu-open");
    });
  });

  // Cerrar menú al hacer click en el overlay (fuera del menú)
  document.addEventListener("click", (e) => {
    const isMenuOpen = mainNav.classList.contains("active");
    const clickedInsideMenu = mainNav.contains(e.target);
    const clickedToggle = menuToggle.contains(e.target);

    // Si el menú está abierto y se hizo click fuera
    if (isMenuOpen && !clickedInsideMenu && !clickedToggle) {
      menuToggle.classList.remove("active");
      mainNav.classList.remove("active");
      document.body.classList.remove("menu-open");
    }
  });
}

// ================================
// LIGHTBOX PARA SCREENSHOTS
// ================================

function initLightbox() {
  // Crear lightbox en el DOM
  const lightbox = document.createElement("div");
  lightbox.id = "lightbox";
  lightbox.className = "lightbox";
  lightbox.innerHTML = `
        <div class="lightbox-content">
            <span class="lightbox-close">&times;</span>
            <img class="lightbox-image" src="" alt="Screenshot completo">
            <div class="lightbox-caption">Click fuera de la imagen para cerrar</div>
        </div>
    `;
  document.body.appendChild(lightbox);

  // Eventos
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("view-screenshot")) {
      const imageSrc = e.target.getAttribute("data-image");
      openLightbox(imageSrc);
    }
  });

  lightbox.addEventListener("click", (e) => {
    if (
      e.target.id === "lightbox" ||
      e.target.classList.contains("lightbox-close")
    ) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });
}

function openLightbox(imageSrc) {
  const lightbox = document.getElementById("lightbox");
  const img = lightbox.querySelector(".lightbox-image");
  img.src = imageSrc;
  lightbox.style.display = "flex";
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  const lightbox = document.getElementById("lightbox");
  lightbox.style.display = "none";
  document.body.style.overflow = "auto";
}

// ================================
// API PÚBLICA PARA AGREGAR POSTS (V1)
// ================================
// Usa esta función desde la consola del navegador para agregar posts rápidamente

window.MovimientoAPI = {
  // Agregar un post nuevo (se agrega después de los posts fijos)
  addPost: (postData) => {
    const post = addPost(postData);
    loadPosts(1); // Recargar el feed
    console.log("✅ Post agregado:", post);
    return post;
  },

  // Ver todos los posts
  getAllPosts: () => {
    console.table(postsDatabase);
    return postsDatabase;
  },

  // Eliminar un post por ID
  deletePost: (id) => {
    const index = postsDatabase.findIndex((p) => p.id === id);
    if (index > -1) {
      postsDatabase.splice(index, 1);
      loadPosts(1);
      console.log("✅ Post eliminado");
    } else {
      console.log("❌ Post no encontrado");
    }
  },

  // Marcar post como destacado
  toggleFeatured: (id) => {
    const post = postsDatabase.find((p) => p.id === id);
    if (post) {
      post.featured = !post.featured;
      loadPosts(1);
      console.log(
        `✅ Post ${post.featured ? "marcado" : "desmarcado"} como destacado`
      );
    }
  },

  // Fijar/desfijar post (NUEVO)
  togglePinned: (id) => {
    const post = postsDatabase.find((p) => p.id === id);
    if (post) {
      post.pinned = !post.pinned;
      loadPosts(1);
      console.log(`✅ Post ${post.pinned ? "fijado" : "desfijado"}`);
    }
  },

  // Ejemplo de uso
  ejemplo: () => {
    console.log(`
📝 EJEMPLOS DE USO - V1

1. Agregar un post (se agrega después de los fijos):
MovimientoAPI.addPost({
    title: "Mi nuevo post",
    description: "Descripción del post",
    image: "https://url-imagen.jpg",
    url: "https://facebook.com/post/123",
    featured: true
});

2. Ver todos los posts:
MovimientoAPI.getAllPosts();

3. Eliminar un post:
MovimientoAPI.deletePost(123456789);

4. Marcar como destacado:
MovimientoAPI.toggleFeatured(123456789);

5. Fijar/desfijar post:
MovimientoAPI.togglePinned(123456789);

NOTA: Los posts de Jovani Salazar y la Página del Movimiento
están FIJADOS y siempre aparecerán primero. 📌
        `);
  },
};

// Mostrar mensaje de bienvenida en consola
console.log(`
🐇 Movimiento de Esperanza y Humanismo de Chiapas
Liderado por Jovani Salazar

📝 Sistema de Posts V1 cargado
📌 2 posts fijos configurados (Jovani + Movimiento)
Escribe MovimientoAPI.ejemplo() para ver cómo agregar posts
`);
