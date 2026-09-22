/* ─────────────────────────────────────────────
   script.js — Premium Portfolio Interactions
───────────────────────────────────────────── */


/* ============================================================
   CURSOR GLOW
============================================================ */

const cursorGlow =
  document.querySelector(".cursor-glow");

let mouseX = 0;
let mouseY = 0;

let glowX = 0;
let glowY = 0;

document.addEventListener("mousemove", e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function animateCursor() {
  glowX += (mouseX - glowX) * 0.08;
  glowY += (mouseY - glowY) * 0.08;

  if (cursorGlow) {
    cursorGlow.style.left = glowX + "px";
    cursorGlow.style.top = glowY + "px";
  }

  requestAnimationFrame(animateCursor);
}

animateCursor();

document.addEventListener("mouseleave", () => {
  if (cursorGlow) {
    cursorGlow.style.opacity = "0";
  }
});

document.addEventListener("mouseenter", () => {
  if (cursorGlow) {
    cursorGlow.style.opacity = "1";
  }
});


/* ============================================================
   NAVBAR — SCROLL COMPACT
============================================================ */

const nav =
  document.querySelector(".nav");

window.addEventListener(
  "scroll",
  () => {
    const y = window.scrollY;

    if (!nav) {
      return;
    }

    if (y > 60) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }
  },
  {
    passive: true
  }
);


/* ============================================================
   SMOOTH MOVING NAVIGATION PILL
============================================================ */

const navContainer =
  document.querySelector(".nav nav");

const navLinks =
  document.querySelectorAll(
    ".nav nav a[href^='#']"
  );

let clickedNavLink = null;
let isNavClickScrolling = false;
let navScrollTimeout = null;


/* ============================================================
   MOVE ORANGE PILL
============================================================ */

function moveNavPill(link) {
  if (!navContainer || !link) {
    return;
  }

  const linkRect =
    link.getBoundingClientRect();

  const navRect =
    navContainer.getBoundingClientRect();

  const x =
    linkRect.left -
    navRect.left;

  const width =
    linkRect.width;

  navContainer.style.setProperty(
    "--nav-pill-x",
    `${x}px`
  );

  navContainer.style.setProperty(
    "--nav-pill-width",
    `${width}px`
  );

  navLinks.forEach(item => {
    item.classList.remove("active");
  });

  link.classList.add("active");
}


/* ============================================================
   FIND ACTIVE SECTION
============================================================ */

function updateActiveNav() {
  if (
    !navContainer ||
    !navLinks.length
  ) {
    return;
  }

  if (isNavClickScrolling) {
    return;
  }

  const triggerPoint =
    window.innerHeight * 0.35;

  let activeLink =
    navLinks[0];

  navLinks.forEach(link => {
    const href =
      link.getAttribute("href");

    if (
      !href ||
      href === "#"
    ) {
      return;
    }

    const section =
      document.querySelector(href);

    if (!section) {
      return;
    }

    const rect =
      section.getBoundingClientRect();

    if (
      rect.top <= triggerPoint
    ) {
      activeLink = link;
    }
  });

  moveNavPill(activeLink);
}


/* ============================================================
   INITIAL NAV POSITION
============================================================ */

function initializeNavPill() {
  if (!navLinks.length) {
    return;
  }

  updateActiveNav();
}

if (
  document.readyState === "loading"
) {
  document.addEventListener(
    "DOMContentLoaded",
    initializeNavPill
  );
} else {
  initializeNavPill();
}

window.addEventListener(
  "load",
  () => {
    updateActiveNav();
  }
);


/* ============================================================
   NAV SCROLL
============================================================ */

let navScrollTicking = false;

window.addEventListener(
  "scroll",
  () => {
    if (isNavClickScrolling) {
      return;
    }

    if (navScrollTicking) {
      return;
    }

    navScrollTicking = true;

    requestAnimationFrame(() => {
      updateActiveNav();
      navScrollTicking = false;
    });
  },
  {
    passive: true
  }
);


/* ============================================================
   NAV CLICK
============================================================ */

navLinks.forEach(link => {
  link.addEventListener(
    "click",
    () => {

      isNavClickScrolling = true;
      clickedNavLink = link;

      moveNavPill(link);

      clearTimeout(
        navScrollTimeout
      );

      navScrollTimeout =
        setTimeout(
          () => {

            isNavClickScrolling =
              false;

            clickedNavLink =
              null;

            updateActiveNav();

          },
          900
        );
    }
  );
});


/* ============================================================
   RESIZE
============================================================ */

window.addEventListener(
  "resize",
  () => {

    const active =
      navContainer?.querySelector(
        "a.active"
      );

    if (active) {
      moveNavPill(active);
    } else {
      updateActiveNav();
    }
  }
);


/* ============================================================
   SCROLL REVEAL
============================================================ */

const revealEls =
  document.querySelectorAll(
    "[data-reveal]"
  );

const revealObs =
  new IntersectionObserver(
    entries => {

      entries.forEach(entry => {

        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add(
          "revealed"
        );

        revealObs.unobserve(
          entry.target
        );

      });

    },
    {
      rootMargin:
        "0px 0px -80px 0px",

      threshold: 0.08
    }
  );

revealEls.forEach(el => {
  revealObs.observe(el);
});


/* ============================================================
   MAGNETIC BUTTONS
============================================================ */

const magnetics =
  document.querySelectorAll(
    ".magnetic"
  );

magnetics.forEach(el => {

  el.addEventListener(
    "mousemove",
    e => {

      const rect =
        el.getBoundingClientRect();

      const cx =
        rect.left +
        rect.width / 2;

      const cy =
        rect.top +
        rect.height / 2;

      const dx =
        (e.clientX - cx) *
        0.35;

      const dy =
        (e.clientY - cy) *
        0.35;

      el.style.transform =
        `translate(${dx}px, ${dy}px)`;
    }
  );

  el.addEventListener(
    "mouseleave",
    () => {
      el.style.transform = "";
    }
  );

});


/* ============================================================
   SMOOTH SCROLL
============================================================ */

document
  .querySelectorAll(
    'a[href^="#"]:not(.nav-links a)'
  )
  .forEach(a => {

    a.addEventListener(
      "click",
      e => {

        const href =
          a.getAttribute("href");

        if (
          !href ||
          href === "#"
        ) {
          return;
        }

        const target =
          document.querySelector(
            href
          );

        if (!target) {
          return;
        }

        e.preventDefault();

        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    );
  });


/* ============================================================
   WORK — VIEW ALL VIDEOS
============================================================ */

const viewAllButtons =
  document.querySelectorAll(
    ".work-view-all"
  );

viewAllButtons.forEach(button => {

  button.addEventListener(
    "click",
    event => {

      event.preventDefault();
      event.stopPropagation();

      const category =
        button.closest(
          ".work-category"
        );

      if (!category) {
        return;
      }

      const reelsGrid =
        category.querySelector(
          ".reels-grid"
        );

      const longformGrid =
        category.querySelector(
          ".longform-grid"
        );

      const grid =
        reelsGrid ||
        longformGrid;

      if (!grid) {
        return;
      }

      const isExpanded =
        grid.classList.contains(
          "show-all"
        );

      if (!isExpanded) {

        grid.classList.add(
          "show-all"
        );

        button.classList.add(
          "is-expanded"
        );

        const text =
          button.querySelector(
            "span"
          );

        if (text) {
          text.textContent = "↙";
        }

        button.childNodes[0].textContent =
          "Show less ";

      } else {

        grid.classList.remove(
          "show-all"
        );

        button.classList.remove(
          "is-expanded"
        );

        const text =
          button.querySelector(
            "span"
          );

        if (text) {
          text.textContent = "↗";
        }

        button.childNodes[0].textContent =
          "View all ";

        const heading =
          category.querySelector(
            ".work-category-head"
          );

        if (heading) {
          heading.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        }
      }
    }
  );
});


/* ============================================================
   WORK CARD HOVER
============================================================ */

document
  .querySelectorAll(
    ".project"
  )
  .forEach(card => {

    card.addEventListener(
      "mouseenter",
      () => {
        card.style.zIndex = "2";
      }
    );

    card.addEventListener(
      "mouseleave",
      () => {
        card.style.zIndex = "";
      }
    );

  });


/* ============================================================
   STAGGERED REVEAL
============================================================ */

const staggerGroups =
  document.querySelectorAll(
    ".work-grid, .stack-grid, .hero-stats"
  );

staggerGroups.forEach(group => {

  Array.from(
    group.children
  ).forEach((child, i) => {

    if (
      !child.hasAttribute(
        "data-reveal"
      )
    ) {

      child.setAttribute(
        "data-reveal",
        ""
      );

      child.setAttribute(
        "data-reveal-delay",
        Math.min(
          i + 1,
          5
        ).toString()
      );

      revealObs.observe(
        child
      );
    }
  });
});


/* ============================================================
   HERO TITLE
============================================================ */

(function splitHeroTitle() {

  const title =
    document.querySelector(
      ".hero-title"
    );

  if (!title) {
    return;
  }

  const em =
    title.querySelector(
      "em"
    );

  if (!em) {
    return;
  }

  em.style.opacity = "0";

  em.style.transform =
    "translateY(16px)";

  em.style.transition =
    "opacity .7s cubic-bezier(.22,.61,.36,1) .5s, " +
    "transform .7s cubic-bezier(.22,.61,.36,1) .5s";

  setTimeout(() => {

    em.style.opacity = "1";
    em.style.transform = "none";

  }, 100);

})();


/* ============================================================
   MARQUEE
============================================================ */

const marquee =
  document.querySelector(
    ".marquee"
  );

if (marquee) {

  marquee.addEventListener(
    "mouseenter",
    () => {
      marquee.style.animationPlayState =
        "paused";
    }
  );

  marquee.addEventListener(
    "mouseleave",
    () => {
      marquee.style.animationPlayState =
        "running";
    }
  );
}


/* ============================================================
   NAV CTA PULSE
============================================================ */

const navCta =
  document.querySelector(
    ".nav-cta"
  );

if (navCta) {

  setTimeout(() => {

    navCta.style.animation =
      "none";

  }, 3000);

}


/* ============================================================
   WORK VIDEO SYSTEM
============================================================

   REELS

   • Videos autoplay muted
   • Hover = muted preview
   • Hovering one stops other previews
   • Hover out = previews resume
   • Click play = LARGE VIDEO
   • LARGE VIDEO USES THE SAME VIDEO ELEMENT
   • No second src assignment
   • No .load()
   • No currentTime reset
   • Close = same video returns to card
   • ESC = close
   • Click outside = close

   LONG FORM

   • YouTube iframe
   • Click play = LARGE YOUTUBE PLAYER
   • Close = return to portfolio

============================================================ */


/* ============================================================
   GET WORK ELEMENTS
============================================================ */

const reelCards =
  document.querySelectorAll(
    ".reel-card"
  );

const longformCards =
  document.querySelectorAll(
    ".longform-card"
  );

const allWorkVideos =
  document.querySelectorAll(
    ".work video"
  );


/* ============================================================
   CREATE VIDEO LIGHTBOX
============================================================ */

let videoLightbox =
  document.querySelector(
    "#videoLightbox"
  );

if (!videoLightbox) {

  videoLightbox =
    document.createElement(
      "div"
    );

  videoLightbox.id =
    "videoLightbox";

  videoLightbox.className =
    "video-lightbox";

  videoLightbox.innerHTML = `

    <button
      class="video-lightbox-close"
      id="videoLightboxClose"
      type="button"
      aria-label="Close video">

      ✕

    </button>

    <div
      class="video-lightbox-content"
      id="videoLightboxContent">

      <video
        id="lightboxVideo"
        playsinline
        controls
        controlsList="nodownload"
        disablePictureInPicture>
      </video>

      <iframe
        id="lightboxYoutube"
        title="Video player"
        allow="autoplay; encrypted-media; picture-in-picture"
        allowfullscreen>
      </iframe>

    </div>

  `;

  document.body.appendChild(
    videoLightbox
  );
}


/* ============================================================
   LIGHTBOX ELEMENTS
============================================================ */

const lightboxContent =
  document.querySelector(
    "#videoLightboxContent"
  );

const lightboxVideo =
  document.querySelector(
    "#lightboxVideo"
  );

const lightboxYoutube =
  document.querySelector(
    "#lightboxYoutube"
  );

const lightboxClose =
  document.querySelector(
    "#videoLightboxClose"
  );


/* ============================================================
   ACTIVE LIGHTBOX VIDEO
============================================================ */

let activeLightboxVideo =
  null;

let activeVideoPlaceholder =
  null;

let activeVideoCard =
  null;

let activeVideoOriginalControls =
  false;


/* ============================================================
   STOP ALL REEL VIDEOS
============================================================ */

function stopAllReelVideos(
  except = null
) {

  reelCards.forEach(
    card => {

      const video =
        card.querySelector(
          "video"
        );

      if (!video) {
        return;
      }

      if (
        video === except
      ) {
        return;
      }

      video.pause();

      video.muted =
        true;

      video.defaultMuted =
        true;

      if (
        !card.classList.contains(
          "is-audio-playing"
        )
      ) {

        try {

          video.currentTime =
            0;

        } catch (error) { }

      }

      card.classList.remove(
        "is-playing"
      );

      card.classList.remove(
        "is-audio-playing"
      );

      const button =
        card.querySelector(
          ".reel-play"
        );

      const icon =
        button?.querySelector(
          "span"
        );

      if (icon) {
        icon.textContent =
          "▶";
      }

    }
  );
}


/* ============================================================
   AUTOPLAY SINGLE VIDEO
============================================================ */

function autoplayVideo(
  video
) {

  if (!video) {
    return;
  }

  video.muted =
    true;

  video.defaultMuted =
    true;

  video.autoplay =
    true;

  video.playsInline =
    true;

  video.setAttribute(
    "muted",
    ""
  );

  video.setAttribute(
    "autoplay",
    ""
  );

  video.setAttribute(
    "playsinline",
    ""
  );

  const promise =
    video.play();

  if (
    promise &&
    typeof promise.catch ===
    "function"
  ) {

    promise.catch(
      () => { }
    );
  }
}


/* ============================================================
   START ALL REEL AUTOPLAY
============================================================ */

function startAllReelAutoplay() {

  reelCards.forEach(
    card => {

      const video =
        card.querySelector(
          "video"
        );

      if (!video) {
        return;
      }

      if (
        card.classList.contains(
          "is-audio-playing"
        )
      ) {
        return;
      }

      video.muted =
        true;

      video.defaultMuted =
        true;

      autoplayVideo(
        video
      );

    }
  );
}


/* ============================================================
   RESET CARD
============================================================ */

function resetCard(
  card
) {

  if (!card) {
    return;
  }

  card.classList.remove(
    "is-playing"
  );

  card.classList.remove(
    "is-audio-playing"
  );

  const button =
    card.querySelector(
      ".reel-play, .longform-play"
    );

  const icon =
    button?.querySelector(
      "span"
    );

  if (icon) {
    icon.textContent =
      "▶";
  }
}


/* ============================================================
   OPEN REEL LIGHTBOX
============================================================

   IMPORTANT:

   We DO NOT create a second video.

   We DO NOT do:

       lightboxVideo.src = video.src

   We DO NOT do:

       lightboxVideo.load()

   We DO NOT change:

       video.currentTime

   Instead, the EXACT SAME VIDEO ELEMENT that
   is already playing in the card is moved into
   the lightbox.

============================================================ */

function openReelLightbox(
  video,
  card
) {

  if (
    !video ||
    !video.src ||
    !lightboxContent ||
    !videoLightbox
  ) {
    return;
  }


  /* ---------------------------------------------
     Stop other preview videos.
     The clicked video is excluded.
  --------------------------------------------- */

  stopAllReelVideos(
    video
  );


  /* ---------------------------------------------
     Save active state
  --------------------------------------------- */

  activeLightboxVideo =
    video;

  activeVideoCard =
    card;

  activeVideoOriginalControls =
    video.controls;


  /* ---------------------------------------------
     Create placeholder

     This lets us return the exact same video
     to the same place after closing.
  --------------------------------------------- */

  activeVideoPlaceholder =
    document.createElement(
      "span"
    );

  activeVideoPlaceholder.className =
    "video-lightbox-placeholder";

  activeVideoPlaceholder.style.display =
    "none";


  if (video.parentNode) {

    video.parentNode.insertBefore(
      activeVideoPlaceholder,
      video
    );

  }


  /* ---------------------------------------------
     The dedicated lightbox video is NOT used
     for R2 reels.
  --------------------------------------------- */

  if (lightboxVideo) {

    lightboxVideo.pause();

    lightboxVideo.removeAttribute(
      "src"
    );

    lightboxVideo.style.display =
      "none";

  }


  /* ---------------------------------------------
     Hide YouTube
  --------------------------------------------- */

  if (lightboxYoutube) {

    lightboxYoutube.src =
      "";

    lightboxYoutube.style.display =
      "none";

  }


  /* ---------------------------------------------
     MOVE THE EXISTING VIDEO

     THIS IS THE MAIN FIX.

     No src change.
     No load.
     No seeking.
     No new request.
  --------------------------------------------- */

  lightboxContent.appendChild(
    video
  );


  /* ---------------------------------------------
     Enable fullscreen controls/audio
  --------------------------------------------- */

  video.controls =
    true;

  video.muted =
    false;

  video.defaultMuted =
    false;

  video.playsInline =
    true;

  video.setAttribute(
    "playsinline",
    ""
  );

  video.style.display =
    "block";


  /* ---------------------------------------------
     Mark card as active
  --------------------------------------------- */

  if (card) {

    card.classList.add(
      "is-audio-playing"
    );

    card.classList.add(
      "is-lightbox-open"
    );

  }


  /* ---------------------------------------------
     Open overlay
  --------------------------------------------- */

  videoLightbox.classList.add(
    "active"
  );

  document.body.style.overflow =
    "hidden";


  /* ---------------------------------------------
     Continue SAME video

     It keeps its currentTime and buffer.
  --------------------------------------------- */

  const playPromise =
    video.play();

  if (
    playPromise &&
    typeof playPromise.catch ===
    "function"
  ) {

    playPromise.catch(
      () => {

        /*
          If browser blocks audio,
          continue silently.
        */

        video.muted =
          true;

        video.play().catch(
          () => { }
        );

      }
    );
  }
}


/* ============================================================
   YOUTUBE URL → EMBED URL
============================================================ */

function getYoutubeEmbedUrl(
  url
) {

  if (!url) {
    return "";
  }

  if (
    url.includes(
      "youtube.com/embed/"
    )
  ) {

    const separator =
      url.includes("?")
        ? "&"
        : "?";

    return (
      url +
      separator +
      "autoplay=1&rel=0"
    );
  }


  const shortMatch =
    url.match(
      /youtu\.be\/([^?&/]+)/
    );

  if (shortMatch) {

    return (
      "https://www.youtube.com/embed/" +
      shortMatch[1] +
      "?autoplay=1&rel=0"
    );
  }


  const watchMatch =
    url.match(
      /[?&]v=([^&]+)/
    );

  if (watchMatch) {

    return (
      "https://www.youtube.com/embed/" +
      watchMatch[1] +
      "?autoplay=1&rel=0"
    );
  }


  return url;
}


/* ============================================================
   OPEN YOUTUBE LIGHTBOX
============================================================ */

function openYoutubeLightbox(
  iframe
) {

  if (!iframe) {
    return;
  }


  /* Stop reel previews */

  stopAllReelVideos();


  /* Clean R2 lightbox video */

  if (lightboxVideo) {

    lightboxVideo.pause();

    lightboxVideo.removeAttribute(
      "src"
    );

    lightboxVideo.style.display =
      "none";
  }


  /* Load YouTube */

  if (lightboxYoutube) {

    lightboxYoutube.style.display =
      "block";

    lightboxYoutube.src =
      getYoutubeEmbedUrl(
        iframe.src
      );
  }


  videoLightbox.classList.add(
    "active"
  );

  document.body.style.overflow =
    "hidden";
}


/* ============================================================
   CLOSE LIGHTBOX
============================================================

   For R2 reels:

   The SAME video is returned to its
   original card.

   We do NOT reload it.

============================================================ */

function closeVideoLightbox() {


  /* ========================================================
     CLOSE R2 REEL
  ======================================================== */

  if (activeLightboxVideo) {

    const video =
      activeLightboxVideo;


    /* Pause only momentarily */

    video.pause();


    /* ---------------------------------------------
       Return SAME VIDEO to original location
    --------------------------------------------- */

    if (
      activeVideoPlaceholder &&
      activeVideoPlaceholder.parentNode
    ) {

      activeVideoPlaceholder.parentNode.insertBefore(
        video,
        activeVideoPlaceholder
      );

      activeVideoPlaceholder.remove();

    }


    /* ---------------------------------------------
       Restore preview settings
    --------------------------------------------- */

    video.controls =
      activeVideoOriginalControls;

    video.muted =
      true;

    video.defaultMuted =
      true;

    video.autoplay =
      true;

    video.playsInline =
      true;

    video.setAttribute(
      "muted",
      ""
    );

    video.setAttribute(
      "autoplay",
      ""
    );

    video.setAttribute(
      "playsinline",
      ""
    );

    video.style.display =
      "";


    /* ---------------------------------------------
       Restore card classes
    --------------------------------------------- */

    if (activeVideoCard) {

      activeVideoCard.classList.remove(
        "is-audio-playing"
      );

      activeVideoCard.classList.remove(
        "is-lightbox-open"
      );

      activeVideoCard.classList.add(
        "is-playing"
      );

    }


    /* ---------------------------------------------
       Resume SAME media element

       No src.
       No load.
       No currentTime.
    --------------------------------------------- */

    video.play().catch(
      () => { }
    );
  }


  /* ========================================================
     CLOSE YOUTUBE
  ======================================================== */

  if (lightboxYoutube) {

    lightboxYoutube.src =
      "";

    lightboxYoutube.style.display =
      "none";
  }


  /* ========================================================
     CLEAN DEDICATED LIGHTBOX VIDEO
  ======================================================== */

  if (lightboxVideo) {

    lightboxVideo.pause();

    lightboxVideo.removeAttribute(
      "src"
    );

    lightboxVideo.style.display =
      "none";
  }


  /* ========================================================
     CLOSE OVERLAY
  ======================================================== */

  videoLightbox.classList.remove(
    "active"
  );

  document.body.style.overflow =
    "";


  /* ========================================================
     RESET STATE
  ======================================================== */

  activeLightboxVideo =
    null;

  activeVideoPlaceholder =
    null;

  activeVideoCard =
    null;

  activeVideoOriginalControls =
    false;
}


/* ============================================================
   CLOSE BUTTON
============================================================ */

if (lightboxClose) {

  lightboxClose.addEventListener(
    "click",
    event => {

      event.preventDefault();

      event.stopPropagation();

      closeVideoLightbox();

    }
  );
}


/* ============================================================
   CLICK OUTSIDE LIGHTBOX
============================================================ */

if (videoLightbox) {

  videoLightbox.addEventListener(
    "click",
    event => {

      if (
        event.target ===
        videoLightbox
      ) {

        closeVideoLightbox();

      }

    }
  );
}


/* ============================================================
   ESC KEY
============================================================ */

document.addEventListener(
  "keydown",
  event => {

    if (
      event.key === "Escape" &&
      videoLightbox &&
      videoLightbox.classList.contains(
        "active"
      )
    ) {

      closeVideoLightbox();

    }

  }
);


/* ============================================================
   REEL INTERACTION
============================================================ */

reelCards.forEach(
  card => {

    const video =
      card.querySelector(
        "video"
      );

    const playButton =
      card.querySelector(
        ".reel-play"
      );

    const progress =
      card.querySelector(
        ".reel-progress span"
      );

    if (!video) {
      return;
    }


    /* --------------------------------------------------------
       INITIAL VIDEO SETTINGS
    -------------------------------------------------------- */

    video.muted =
      true;

    video.defaultMuted =
      true;

    video.autoplay =
      true;

    video.loop =
      true;

    video.playsInline =
      true;

    video.setAttribute(
      "muted",
      ""
    );

    video.setAttribute(
      "autoplay",
      ""
    );

    video.setAttribute(
      "playsinline",
      ""
    );


    /* --------------------------------------------------------
       HOVER IN
    -------------------------------------------------------- */

    card.addEventListener(
      "mouseenter",
      () => {

        if (
          card.classList.contains(
            "is-audio-playing"
          )
        ) {
          return;
        }


        stopAllReelVideos(
          video
        );


        video.muted =
          true;

        video.defaultMuted =
          true;


        video.play().catch(
          () => { }
        );


        card.classList.add(
          "is-playing"
        );

      }
    );


    /* --------------------------------------------------------
       HOVER OUT
    -------------------------------------------------------- */

    card.addEventListener(
      "mouseleave",
      () => {

        if (
          card.classList.contains(
            "is-audio-playing"
          )
        ) {
          return;
        }


        video.pause();


        /*
          Reset only when leaving the
          preview card.
        */

        try {

          video.currentTime =
            0;

        } catch (error) { }


        card.classList.remove(
          "is-playing"
        );


        /*
          Resume other previews.
        */

        reelCards.forEach(
          otherCard => {

            if (
              otherCard === card
            ) {
              return;
            }


            if (
              otherCard.classList.contains(
                "is-audio-playing"
              )
            ) {
              return;
            }


            const otherVideo =
              otherCard.querySelector(
                "video"
              );


            if (!otherVideo) {
              return;
            }


            otherVideo.muted =
              true;

            otherVideo.defaultMuted =
              true;


            otherVideo.play().catch(
              () => { }
            );


            otherCard.classList.add(
              "is-playing"
            );

          }
        );

      }
    );


    /* --------------------------------------------------------
       PLAY BUTTON → LARGE VIDEO
    -------------------------------------------------------- */

    if (playButton) {

      playButton.addEventListener(
        "click",
        event => {

          event.preventDefault();

          event.stopPropagation();


          openReelLightbox(
            video,
            card
          );

        }
      );
    }


    /* --------------------------------------------------------
       PROGRESS BAR
    -------------------------------------------------------- */

    video.addEventListener(
      "timeupdate",
      () => {

        if (
          !progress ||
          !video.duration
        ) {
          return;
        }


        const percentage =
          (
            video.currentTime /
            video.duration
          ) * 100;


        progress.style.width =
          `${percentage}%`;

      }
    );


    /* --------------------------------------------------------
       VIDEO ENDED
    -------------------------------------------------------- */

    video.addEventListener(
      "ended",
      () => {

        resetCard(
          card
        );

      }
    );

  }
);


/* ============================================================
   LONG-FORM YOUTUBE
============================================================ */

longformCards.forEach(
  card => {

    const iframe =
      card.querySelector(
        "iframe"
      );

    const playButton =
      card.querySelector(
        ".longform-play"
      );

    if (
      !iframe ||
      !playButton
    ) {
      return;
    }


    /*
      Prevent direct interaction with
      the small iframe underneath.
    */

    iframe.style.pointerEvents =
      "none";


    /* --------------------------------------------------------
       PLAY BUTTON → LARGE YOUTUBE
    -------------------------------------------------------- */

    playButton.addEventListener(
      "click",
      event => {

        event.preventDefault();

        event.stopPropagation();


        openYoutubeLightbox(
          iframe
        );

      }
    );


    /* --------------------------------------------------------
       CLICK LONG-FORM MEDIA
    -------------------------------------------------------- */

    const media =
      card.querySelector(
        ".longform-media"
      );

    if (media) {

      media.addEventListener(
        "click",
        event => {

          if (
            event.target.closest(
              ".longform-play"
            )
          ) {
            return;
          }


          openYoutubeLightbox(
            iframe
          );

        }
      );
    }

  }
);


/* ============================================================
   VIDEO CONTEXT MENU / DRAG PROTECTION
============================================================ */

allWorkVideos.forEach(
  video => {

    video.addEventListener(
      "contextmenu",
      event => {

        event.preventDefault();

      }
    );


    video.addEventListener(
      "dragstart",
      event => {

        event.preventDefault();

      }
    );

  }
);


/* ============================================================
   INITIAL AUTOPLAY
============================================================ */

function initializeWorkVideos() {

  reelCards.forEach(
    card => {

      const video =
        card.querySelector(
          "video"
        );

      if (!video) {
        return;
      }


      video.muted =
        true;

      video.defaultMuted =
        true;

      video.autoplay =
        true;

      video.playsInline =
        true;


      autoplayVideo(
        video
      );

    }
  );
}


/* ============================================================
   DOM READY
============================================================ */

if (
  document.readyState ===
  "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    initializeWorkVideos
  );

} else {

  initializeWorkVideos();

}


/* ============================================================
   WINDOW LOAD
============================================================ */

window.addEventListener(
  "load",
  () => {

    initializeWorkVideos();

    updateActiveNav();

  }
);


/* ============================================================
   VISIBILITY CHANGE
============================================================ */

document.addEventListener(
  "visibilitychange",
  () => {

    if (
      document.visibilityState !==
      "visible"
    ) {
      return;
    }


    reelCards.forEach(
      card => {

        if (
          card.classList.contains(
            "is-audio-playing"
          )
        ) {
          return;
        }


        const video =
          card.querySelector(
            "video"
          );


        if (!video) {
          return;
        }


        video.muted =
          true;

        video.defaultMuted =
          true;


        video.play().catch(
          () => { }
        );

      }
    );

  }
);


/* ============================================================
   FINAL AUTOPLAY RETRY
============================================================ */

setTimeout(
  () => {

    reelCards.forEach(
      card => {

        if (
          card.classList.contains(
            "is-audio-playing"
          )
        ) {
          return;
        }


        const video =
          card.querySelector(
            "video"
          );


        if (!video) {
          return;
        }


        if (
          video.paused
        ) {

          video.muted =
            true;

          video.defaultMuted =
            true;


          video.play().catch(
            () => { }
          );

        }

      }
    );

  },
  1000
);
