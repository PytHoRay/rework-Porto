/* =============================================
   0. GREETING OVERLAY
============================================= */
(function () {
    const overlay = document.getElementById("greeting-overlay");
    const textEl = document.getElementById("greeting-text");
    if (!overlay || !textEl) return;

    const greetings = [
        "Hello" /* English   */,
        "こんにちは" /* Japanese  */,
        "안녕하세요" /* Korean    */,
        "你好" /* Chinese   */,
        "नमस्ते" /* Hindi     */,
        "ສະບາຍດີ" /* Lao       */,
        "Привет" /* Russian   */,
        "ہیلو" /* Pakistani */,
        "مرحبا" /* Arabic SA */,
        "Merhaba" /* Turkish   */,
        "أهلاً" /* Egyptian  */,
        "Halo" /* Indonesian */
    ];

    const SHOW_DURATION = 240;
    const FADE_DURATION = 160;
    let index = 0;

    function showNext() {
        if (index >= greetings.length) {
            textEl.classList.remove("show");
            textEl.classList.add("hide");

            setTimeout(() => {
                overlay.classList.add("swipe-up");

                /* Dismiss logic — uses both transitionend AND a fallback timeout.
                   The CSS transition is now on the base element (not .swipe-up),
                   so transitionend fires reliably. The setTimeout is a safety net. */
                let dismissed = false;
                function afterSwipe() {
                    if (dismissed) return;
                    dismissed = true;
                    overlay.classList.add("hidden");
                    setTimeout(() => {
                        const tonearm = document.getElementById("tonearm");
                        const vinylDisc = document.getElementById("vinylDisc");
                        if (!tonearm || !vinylDisc) return;
                        tonearm.classList.add("playing");
                        setTimeout(() => {
                            vinylDisc.classList.add("playing");
                        }, 960);
                    }, 1000);
                }

                overlay.addEventListener("transitionend", afterSwipe, {
                    once: true
                });
                /* Fallback: fires after 0.9s transition + 150ms buffer */
                setTimeout(afterSwipe, 1050);
            }, FADE_DURATION + 80);
            return;
        }

        textEl.textContent = greetings[index];
        textEl.classList.remove("hide");
        textEl.classList.add("show");

        setTimeout(() => {
            textEl.classList.remove("show");
            textEl.classList.add("hide");
            setTimeout(() => {
                index++;
                showNext();
            }, FADE_DURATION);
        }, SHOW_DURATION);
    }

    setTimeout(showNext, 200);
})();

document.body.classList.add("js-loaded");

/* =============================================
   1. INITIALIZE EmailJS
============================================= */
const EMAILJS_PUBLIC_KEY = "53TfiDQ80swje6P3s";
const EMAILJS_SERVICE_ID = "service_kfxzu0c";
const EMAILJS_TEMPLATE_ID = "template_uy7yzwq";

if (typeof emailjs !== "undefined") {
    emailjs.init(EMAILJS_PUBLIC_KEY);
}

/* =============================================
   2. CUSTOM CURSOR
============================================= */
const dot = document.getElementById("cursor-dot");
const ring = document.getElementById("cursor-ring");
let ringX = 0,
    ringY = 0,
    mouseX = 0,
    mouseY = 0;

document.body.style.cursor = "none";

document.addEventListener("mousemove", e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + "px";
    dot.style.top = mouseY + "px";
});

function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + "px";
    ring.style.top = ringY + "px";
    requestAnimationFrame(animateRing);
}
animateRing();

document
    .querySelectorAll(
        "a, button, .project-card, .flip-card, .skill-tag, .tech-item, .cert-card"
    )
    .forEach(el => {
        el.addEventListener("mouseenter", () =>
            document.body.classList.add("cursor-hover")
        );
        el.addEventListener("mouseleave", () =>
            document.body.classList.remove("cursor-hover")
        );
    });

/* =============================================
   3. TYPED.JS — Hero typing animation
============================================= */
if (typeof Typed !== "undefined") {
    new Typed("#typed-output", {
        strings: [
            "I'm a Student.",
            "I'm a Python Enthusiast.",
            "I'm an Aspiring Data Analyst.",
            "I'm a Web Developer (in progress!).",
            "I'm a Problem Solver."
        ],
        typeSpeed: 55,
        backSpeed: 30,
        backDelay: 2000,
        loop: true,
        smartBackspace: true
    });
} else {
    document.getElementById("typed-output").textContent =
        "I'm a Python Enthusiast.";
}

/* =============================================
   4. NAVIGATION — scroll shadow & mobile toggle
============================================= */
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 30);
});

const navToggle = document.getElementById("navToggle");
const mobileMenu = document.getElementById("mobileMenu");
let menuOpen = false;

navToggle.addEventListener("click", () => {
    menuOpen = !menuOpen;
    mobileMenu.classList.toggle("open", menuOpen);
    const spans = navToggle.querySelectorAll("span");
    if (menuOpen) {
        spans[0].style.transform = "rotate(28deg) translate(5px, 5px)";
        spans[1].style.opacity = "0";
        spans[2].style.transform = "rotate(-28deg) translate(5px, -5px)";
    } else {
        spans.forEach(s => {
            s.style.transform = "";
            s.style.opacity = "";
        });
    }
});

document.querySelectorAll(".mobile-link").forEach(link => {
    link.addEventListener("click", () => {
        menuOpen = false;
        mobileMenu.classList.remove("open");
        navToggle.querySelectorAll("span").forEach(s => {
            s.style.transform = "";
            s.style.opacity = "";
        });
    });
});

/* =============================================
   5. SCROLL REVEAL — IntersectionObserver
============================================= */
const revealObserver = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                revealObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

/* =============================================
   6. TIMELINE — scroll-triggered items + SVG path
============================================= */
const timelineItems = document.querySelectorAll(".timeline-item");
const tlObserver = new IntersectionObserver(
    entries => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(
                    () => entry.target.classList.add("visible"),
                    i * 160
                );
                tlObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.2 }
);

timelineItems.forEach(item => tlObserver.observe(item));

function buildTimelineSvg() {
    const svg = document.getElementById("timelineSvg");
    const items = document.querySelectorAll(".timeline-item");
    if (!items.length || !svg) return;

    const wrapper = document.getElementById("timelineWrapper");
    const itemsContainer = wrapper.querySelector(".timeline-items");
    const totalH = wrapper.offsetHeight;
    const containerShift = itemsContainer ? itemsContainer.offsetTop : 0;

    svg.style.height = totalH + "px";
    svg.setAttribute("viewBox", `0 0 120 ${totalH}`);

    let d = `M 60 0`;
    items.forEach((item, i) => {
        const dotY = containerShift + item.offsetTop + item.offsetHeight / 2;
        const cx = i % 2 === 0 ? 20 : 100;
        d += ` C ${cx} ${dotY - 80}, ${cx} ${dotY}, 60 ${dotY}`;
    });
    d += ` L 60 ${totalH}`;
    svg.innerHTML = `<path class="timeline-path" id="timelinePath" d="${d}" />`;

    const path = document.getElementById("timelinePath");
    const pathLen = path.getTotalLength();
    path.style.strokeDasharray = pathLen;
    path.style.strokeDashoffset = pathLen;

    updateTimelineDraw();
}

function updateTimelineDraw() {
    const path = document.getElementById("timelinePath");
    const wrapper = document.getElementById("timelineWrapper");
    if (!path || !wrapper) return;

    const pathLen = path.getTotalLength();
    const wrapRect = wrapper.getBoundingClientRect();
    const winH = window.innerHeight;
    const progress = Math.min(
        1,
        Math.max(0, (winH - wrapRect.top) / (wrapRect.height * 1.29))
    );
    path.style.strokeDashoffset = pathLen * (1 - progress);
}

window.addEventListener("load", buildTimelineSvg);
window.addEventListener("resize", buildTimelineSvg);
window.addEventListener("scroll", updateTimelineDraw, { passive: true });

/* =============================================
   7. PROJECTS — modal data & open/close
============================================= */
const projects = {
    1: {
        title: "Small Python Project",
        thumbnail: "img/project1.jpg",
        sections: [
            {
                heading: "Overview",
                content:
                    "Creating Database Maker (create Table based on sqlite3), Downloader (mp4 and m4a), Visualizing Data Diagrams with Matplotlib and Tracker File"
            },
            {
                heading: "What It Does",
                content:
                    "Creating Table to simulate SQL Query, Downloader makes it easy for me to get materials to make Videos or Study from YouTube, Visualizing Data to understand more deeply the function of Python in the World of Data"
            },
            {
                heading: "Key Learnings",
                content:
                    "Thoose Projects is my First Step in World of Data. They were born out of my curiosity and desire to try."
            },
            {
                heading: "Technologies",
                isTechStack: true,
                items: [
                    "Python 3",
                    "yt-dlp",
                    "Matplotlib",
                    "sqlite",
                    "CSV Module"
                ]
            }
        ]
    },
    2: {
        title: "Class Website",
        thumbnail: "img/project2.jpg",
        liveUrl: "https://softwaretwo.web.app/",
        sections: [
            {
                heading: "Overview",
                content:
                    "A Website that contains all about Class, such Teacher, Students, Socials Media, this web have Productive Mode, the contents like Programming Fundamental, Carier Path and Explanation about 12 Different Programming Language (Pyton, Java, Js, C, C++, Swift, Kotlin, Ruby, Rust, R, Go)"
            },
            {
                heading: "Why I Built It",
                content:
                    "I curious about Web Development and I want my Class have thier own Website, since I can't Full-Stack Web Developer, I try other way, it's Vibe Coding"
            },
            {
                heading: "Technologies",
                isTechStack: true,
                items: [
                    "Firebase Vibe Coding",
                    "Typescript",
                    "Node.js",
                    "React",
                    "SSG"
                ]
            }
        ]
    },
    3: {
        title: "This Portfolio Website",
        thumbnail: "img/project3.jpg",
        sections: [
            {
                heading: "Overview",
                content:
                    "The very site you're viewing right now! A single-page portfolio designed to showcase my projects, skills, and journey as a young developer."
            },
            {
                heading: "Design Goals",
                content:
                    "Elegant and classy aesthetic with a white base, refined typography using Cormorant Garamond, and subtle gold accents. Emphasis on smooth animations and micro-interactions."
            },
            {
                heading: "Technical Highlights",
                content:
                    "Custom cursor, Typed.js for the hero animation, CSS flip cards, an SVG-animated timeline, scroll-reveal effects via IntersectionObserver, and EmailJS for the contact form, Auto playing Tonearm (clickable Tonearm) and Music Disc (desktop), Saturn and Orbital decoration"
            },
            {
                heading: "Technologies",
                isTechStack: true,
                items: [
                    "HTML",
                    "CSS",
                    "JavaScript",
                    "Typed.js",
                    "EmailJS",
                    "Firebase"
                ]
            }
        ]
    }
};

function openModal(id) {
    const data = projects[id];
    if (!data) return;

    document.getElementById("modalTitle").textContent = data.title;

    const body = document.getElementById("modalBody");
    let html = "";

    /* FIX: onerror was previously truncated to 'nonek — now properly closed */
    if (data.thumbnail) {
        html += `<div class="project-modal-thumb" onclick="openLightbox('${data.thumbnail}', '${data.title}')" title="Click to view full image">
  <img src="${data.thumbnail}" alt="${data.title}" loading="lazy" onerror="this.style.display='none'">
  <span class="project-modal-thumb-hint">View Full ↗</span>
</div>`;
    }

    if (data.liveUrl) {
        html += `<div class="project-modal-section">
  <a href="${data.liveUrl}" target="_blank" rel="noopener" class="project-modal-link">Go to Website ↗</a>
</div>`;
    }

    html += data.sections
        .map(sec => {
            if (sec.isTechStack) {
                return `<div class="project-modal-section">
  <h4>${sec.heading}</h4>
  <div class="tech-stack">${sec.items.map(t => `<span class="tech-item">${t}</span>`).join("")}</div>
</div>`;
            }
            return `<div class="project-modal-section">
  <h4>${sec.heading}</h4>
  <p>${sec.content}</p>
</div>`;
        })
        .join("");

    body.innerHTML = html;

    document.getElementById("projectModal").classList.add("active");
    document.body.style.overflow = "hidden";
}

function closeModal() {
    document.getElementById("projectModal").classList.remove("active");
    document.body.style.overflow = "";
}

document.getElementById("projectModal").addEventListener("click", e => {
    if (e.target === document.getElementById("projectModal")) closeModal();
});

document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
        closeModal();
        closeLightbox();
    }
});

/* =============================================
   8. CONTACT FORM — EmailJS submission
============================================= */
document
    .getElementById("contactForm")
    .addEventListener("submit", async function (e) {
        e.preventDefault();

        const btn = document.getElementById("submitBtn");
        const statusEl = document.getElementById("formStatus");
        const submitText = document.getElementById("submitText");
        const submitArr = document.getElementById("submitArrow");

        const name = document.getElementById("contact-name").value.trim();
        const email = document.getElementById("contact-email").value.trim();
        const message = document.getElementById("contact-message").value.trim();

        if (!name || !email || !message) {
            showStatus("error", "Please fill in all required fields.");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showStatus("error", "Please enter a valid email address.");
            return;
        }

        btn.disabled = true;
        submitText.textContent = "Sending...";
        submitArr.textContent = "⏳";
        statusEl.style.display = "none";
        statusEl.className = "form-status";

        try {
            await emailjs.sendForm(
                EMAILJS_SERVICE_ID,
                EMAILJS_TEMPLATE_ID,
                this
            );
            showToast(
                "Message Sent!",
                "Thanks for reaching out — I'll get back to you soon."
            );
            showStatus("success", "✓ Message sent! I'll get back to you soon.");
            this.reset();
        } catch (err) {
            console.error("EmailJS error:", err);
            if (EMAILJS_PUBLIC_KEY === "YOUR_PUBLIC_KEY") {
                showStatus(
                    "error",
                    "⚙ EmailJS is not configured yet. Please follow the setup instructions in the code comments."
                );
            } else {
                showStatus(
                    "error",
                    "✕ Something went wrong. Please try emailing me directly at auliaramadhanrayhan@gmail.com"
                );
            }
        } finally {
            btn.disabled = false;
            submitText.textContent = "Send Message";
            submitArr.textContent = "→";
        }
    });

function showStatus(type, message) {
    const el = document.getElementById("formStatus");
    el.textContent = message;
    el.className = "form-status " + type;
}

/* =============================================
   TOAST NOTIFICATION
============================================= */
function showToast(title, message) {
    let container = document.getElementById("toast-container");
    if (!container) {
        container = document.createElement("div");
        container.id = "toast-container";
        document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.style.position = "relative";
    toast.style.overflow = "hidden";
    toast.innerHTML = `
    <div class="toast-icon">✉</div>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-message">${message}</div>
    </div>
    <button class="toast-close" aria-label="Dismiss">✕</button>
    <div class="toast-progress"></div>
  `;

    container.appendChild(toast);

    requestAnimationFrame(() => {
        requestAnimationFrame(() => toast.classList.add("toast-show"));
    });

    const dismiss = () => {
        toast.classList.remove("toast-show");
        toast.classList.add("toast-hide");
        toast.addEventListener("transitionend", () => toast.remove(), {
            once: true
        });
    };

    toast.querySelector(".toast-close").addEventListener("click", dismiss);
    setTimeout(dismiss, 5000);
}

/* =============================================
   9. PARALLAX — subtle hero orb on scroll
============================================= */
window.addEventListener("scroll", () => {
    const scrolled = window.scrollY;
    const orb1 = document.querySelector(".orb-1");
    const orb2 = document.querySelector(".orb-2");
    if (orb1) orb1.style.transform = `translateY(${scrolled * 0.15}px)`;
    if (orb2) orb2.style.transform = `translateY(${scrolled * -0.1}px)`;
});

/* =============================================
   10. TONEARM — click to play / stop vinyl
============================================= */
(function () {
    const tonearm = document.getElementById("tonearm");
    const vinylDisc = document.getElementById("vinylDisc");
    if (!tonearm || !vinylDisc) return;

    let playing = tonearm.classList.contains("playing");
    let discTimer = null;

    tonearm.addEventListener("click", () => {
        playing = !playing;
        tonearm.classList.toggle("playing", playing);

        if (playing) {
            discTimer = setTimeout(() => {
                vinylDisc.classList.add("playing");
            }, 960);
        } else {
            clearTimeout(discTimer);
            vinylDisc.classList.remove("playing");
        }
    });
})();

/* =============================================
   11. POLAROID FLIP — click toggles photo ↔ card
============================================= */
(function () {
    const card = document.querySelector(".polaroid-card");
    const inner = document.querySelector(".polaroid-inner");
    const front = document.querySelector(".polaroid-front");
    const back = document.querySelector(".polaroid-back");
    if (!card || !inner) return;

    let isFlipped = false;
    let isAnimating = false;

    card.addEventListener("click", () => {
        if (isAnimating) return;
        isAnimating = true;

        const DURATION = 1500;
        inner.classList.add("spinning");

        setTimeout(() => {
            isFlipped = !isFlipped;
            if (isFlipped) {
                front.style.transform = "rotateY(180deg)";
                back.style.transform = "rotateY(0deg)";
            } else {
                front.style.transform = "rotateY(0deg)";
                back.style.transform = "rotateY(180deg)";
            }
        }, DURATION * 0.25);

        inner.addEventListener("transitionend", function onDone() {
            inner.removeEventListener("transitionend", onDone);
            inner.style.transition = "none";
            inner.style.transform = "rotateY(0deg)";
            inner.getBoundingClientRect();
            inner.style.transition = "";
            inner.style.transform = "";
            inner.classList.remove("spinning");
            isAnimating = false;
        });
    });
})();

/* =============================================
   12. LIGHTBOX — full-image viewer
============================================= */
function openLightbox(src, caption) {
    const overlay = document.getElementById("lightbox-overlay");
    const img = document.getElementById("lightbox-img");
    const cap = document.getElementById("lightbox-caption");

    img.src = src;
    img.alt = caption || "";
    cap.textContent = caption || "";

    overlay.classList.add("active");
    document.body.style.overflow = "hidden";
}

/* FIX: closeLightbox was truncated (file ended mid-function) — this was the
   root cause of the JavaScript syntax error that caused the black screen.
   A broken script means NO JS runs at all, so the greeting overlay never
   dismissed and the page stayed permanently black. */
function closeLightbox() {
    const overlay = document.getElementById("lightbox-overlay");
    overlay.classList.remove("active");
    /* Only restore scroll if project modal is also closed */
    if (!document.getElementById("projectModal").classList.contains("active")) {
        document.body.style.overflow = "";
    }
}
