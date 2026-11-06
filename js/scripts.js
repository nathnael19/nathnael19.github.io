document.addEventListener("DOMContentLoaded", () => {
    // --- Elements ---
    const mobileToggle = document.getElementById("mobileToggle");
    const mobileMenu = document.getElementById("mobileMenu");
    const mobileLinks = document.querySelectorAll(".mobile-link");
    const themeToggle = document.getElementById("themeToggle");
    const toast = document.getElementById("toast");
    const copyTriggers = document.querySelectorAll(".copy-trigger");
    const navLinks = document.querySelectorAll(".desktop-menu .nav-link");

    // --- Toast Notification Helper ---
    let toastTimer = null;
    const showToast = (message, type = "success") => {
        if (!toast) return;
        toast.textContent = message;
        toast.className = `toast visible ${type}`;

        if (toastTimer) clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
            toast.className = "toast";
        }, 3600);
    };

    // --- Theme Switcher (Dark Ink by default, Warm Light option) ---
    const applyTheme = (theme) => {
        const icon = themeToggle ? themeToggle.querySelector("i") : null;
        if (theme === "light") {
            document.body.classList.add("light-mode");
            if (icon) {
                icon.className = "fas fa-moon";
            }
        } else {
            document.body.classList.remove("light-mode");
            if (icon) {
                icon.className = "fas fa-sun";
            }
        }
    };

    const savedTheme = localStorage.getItem("bulbula-theme") || localStorage.getItem("portfolio_theme");
    const initialTheme = savedTheme || "dark";
    applyTheme(initialTheme);

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            const isLight = document.body.classList.contains("light-mode");
            const next = isLight ? "dark" : "light";
            applyTheme(next);
            localStorage.setItem("bulbula-theme", next);
            localStorage.setItem("portfolio_theme", next);
        });
    }

    // --- Mobile Menu Toggle ---
    if (mobileToggle && mobileMenu) {
        mobileToggle.addEventListener("click", () => {
            const open = mobileMenu.classList.toggle("active");
            mobileToggle.classList.toggle("active");
            mobileToggle.setAttribute("aria-expanded", String(open));
        });

        mobileLinks.forEach((link) => {
            link.addEventListener("click", () => {
                mobileMenu.classList.remove("active");
                mobileToggle.classList.remove("active");
                mobileToggle.setAttribute("aria-expanded", "false");
            });
        });

        document.addEventListener("click", (e) => {
            const header = document.querySelector("header");
            if (header && !header.contains(e.target) && mobileMenu.classList.contains("active")) {
                mobileMenu.classList.remove("active");
                mobileToggle.classList.remove("active");
                mobileToggle.setAttribute("aria-expanded", "false");
            }
        });
    }

    // --- Active Link on Scroll ---
    const sections = document.querySelectorAll("section[id]");
    const updateActiveNav = () => {
        const scrollY = window.scrollY + 140;

        sections.forEach((sec) => {
            const top = sec.offsetTop;
            const height = sec.offsetHeight;
            const id = sec.getAttribute("id");

            if (scrollY >= top && scrollY < top + height) {
                navLinks.forEach((item) => {
                    if (item.getAttribute("href") === `#${id}`) {
                        item.classList.add("active");
                    } else {
                        item.classList.remove("active");
                    }
                });
            }
        });
    };
    window.addEventListener("scroll", updateActiveNav, { passive: true });

    // --- Copy to Clipboard Triggers ---
    copyTriggers.forEach((btn) => {
        btn.addEventListener("click", async () => {
            const text = btn.getAttribute("data-copy");
            if (!text) return;

            try {
                await navigator.clipboard.writeText(text);
                const prev = btn.innerHTML;
                btn.innerHTML = '<i class="fas fa-check" style="color: var(--color-gold-500);"></i>';
                showToast(`Copied "${text}" to clipboard!`);
                setTimeout(() => {
                    btn.innerHTML = prev;
                }, 2000);
            } catch (err) {
                showToast("Please copy text manually.", "error");
            }
        });
    });

    // --- Interactive Estimator Engine ---
    const projectTypeCards = document.querySelectorAll("#projectTypeGroup .est-card");
    const featureCheckboxes = document.querySelectorAll("#featuresGroup input[type='checkbox']");
    const paceButtons = document.querySelectorAll("#paceGroup .pace-btn");

    const priceMinEl = document.getElementById("priceMin");
    const priceMaxEl = document.getElementById("priceMax");
    const weeksMinEl = document.getElementById("weeksMin");
    const weeksMaxEl = document.getElementById("weeksMax");
    const useEstimateBtn = document.getElementById("useEstimateBtn");

    let selectedType = {
        name: "Web Application",
        basePrice: 40000,
        days: 30,
    };
    let selectedFeatures = [];
    let selectedPace = {
        name: "Standard Timeline",
        multiplier: 1.0,
        timeMultiplier: 1.0,
    };

    const calculateEstimate = () => {
        let totalBase = selectedType.basePrice;
        let totalDays = selectedType.days;

        selectedFeatures = [];
        featureCheckboxes.forEach((cb) => {
            if (cb.checked) {
                const price = Number(cb.getAttribute("data-price")) || 0;
                const days = Number(cb.getAttribute("data-days")) || 0;
                const infoTitle = cb.closest(".feature-checkbox")?.querySelector("strong")?.textContent || cb.value;
                selectedFeatures.push(infoTitle);
                totalBase += price;
                totalDays += days;
            }
        });

        const adjustedPrice = Math.round(totalBase * selectedPace.multiplier);
        const minPrice = Math.round(adjustedPrice * 0.95);
        const maxPrice = Math.round(adjustedPrice * 1.15);

        const adjustedDays = Math.max(10, Math.round(totalDays * selectedPace.timeMultiplier));
        const minWeeks = Math.max(2, Math.floor(adjustedDays / 7));
        const maxWeeks = minWeeks + 2;

        if (priceMinEl) priceMinEl.textContent = minPrice.toLocaleString();
        if (priceMaxEl) priceMaxEl.textContent = maxPrice.toLocaleString();
        if (weeksMinEl) weeksMinEl.textContent = String(minWeeks);
        if (weeksMaxEl) weeksMaxEl.textContent = String(maxWeeks);
    };

    // Project type selection
    projectTypeCards.forEach((card) => {
        card.addEventListener("click", () => {
            projectTypeCards.forEach((c) => c.classList.remove("active"));
            card.classList.add("active");

            selectedType = {
                name: card.querySelector("strong")?.textContent || "Web Application",
                basePrice: Number(card.getAttribute("data-base")) || 40000,
                days: Number(card.getAttribute("data-days")) || 30,
            };
            calculateEstimate();
        });
    });

    // Feature toggles
    featureCheckboxes.forEach((cb) => {
        cb.addEventListener("change", calculateEstimate);
    });

    // Pace selection
    paceButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            paceButtons.forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");

            selectedPace = {
                name: btn.querySelector("strong")?.textContent || "Standard",
                multiplier: Number(btn.getAttribute("data-multiplier")) || 1.0,
                timeMultiplier: Number(btn.getAttribute("data-timemult")) || 1.0,
            };
            calculateEstimate();
        });
    });

    // Initial calculation
    calculateEstimate();

    // Use Estimate Button -> Prefill Contact Form
    if (useEstimateBtn) {
        useEstimateBtn.addEventListener("click", () => {
            const scopeSelect = document.getElementById("projectScope");
            const subjectInput = document.getElementById("userSubject");
            const messageArea = document.getElementById("userMessage");

            if (scopeSelect) {
                // Match option text or value
                for (let i = 0; i < scopeSelect.options.length; i++) {
                    if (scopeSelect.options[i].text.toLowerCase().includes(selectedType.name.toLowerCase().slice(0, 5))) {
                        scopeSelect.selectedIndex = i;
                        break;
                    }
                }
            }

            if (subjectInput) {
                subjectInput.value = `New Project Estimate: ${selectedType.name} (${priceMinEl.textContent} - ${priceMaxEl.textContent} Br)`;
            }

            if (messageArea) {
                const featText = selectedFeatures.length > 0 ? selectedFeatures.join(", ") : "Core foundation";
                messageArea.value = `Hi Nathnael, I used your project estimator on the portfolio.

Selected Scope: ${selectedType.name}
Included Features: ${featText}
Delivery Pace: ${selectedPace.name}
Estimated Range: ${priceMinEl.textContent} — ${priceMaxEl.textContent} ETB (${weeksMinEl.textContent} - ${weeksMaxEl.textContent} weeks)

Looking to discuss kickoff details...`;
            }

            // Scroll to contact form smoothly
            const contactSection = document.getElementById("contact");
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: "smooth" });
                showToast("Your estimate was populated into the form below!");
            }
        });
    }

    // --- Contact Form Submission & Validation ---
    const inquiryForm = document.getElementById("projectInquiryForm");
    if (inquiryForm) {
        const nameInput = document.getElementById("userName");
        const emailInput = document.getElementById("userEmail");
        const subjectInput = document.getElementById("userSubject");
        const messageInput = document.getElementById("userMessage");
        const submitBtn = document.getElementById("submitInquiryBtn");

        const clearErr = (input, errEl) => {
            input.classList.remove("invalid");
            if (errEl) errEl.textContent = "";
        };

        const setErr = (input, errEl, text) => {
            input.classList.add("invalid");
            if (errEl) errEl.textContent = text;
        };

        [nameInput, emailInput, subjectInput, messageInput].forEach((inp) => {
            if (!inp) return;
            const errEl = document.getElementById(`${inp.id.replace("user", "").toLowerCase()}Error`) ||
                          document.getElementById(`${inp.id}Error`);
            inp.addEventListener("input", () => clearErr(inp, errEl));
        });

        inquiryForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            let isValid = true;
            const nameErr = document.getElementById("nameError");
            const emailErr = document.getElementById("emailError");
            const subjectErr = document.getElementById("subjectError");
            const messageErr = document.getElementById("messageError");
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!nameInput.value.trim()) {
                setErr(nameInput, nameErr, "Please enter your name.");
                isValid = false;
            }

            if (!emailInput.value.trim()) {
                setErr(emailInput, emailErr, "Please enter your email address.");
                isValid = false;
            } else if (!emailRegex.test(emailInput.value.trim())) {
                setErr(emailInput, emailErr, "Please enter a valid email address.");
                isValid = false;
            }

            if (!subjectInput.value.trim()) {
                setErr(subjectInput, subjectErr, "Please enter a subject.");
                isValid = false;
            }

            if (!messageInput.value.trim()) {
                setErr(messageInput, messageErr, "Please describe your project.");
                isValid = false;
            }

            if (!isValid) return;

            const originalBtn = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';

            const formData = new FormData(inquiryForm);

            try {
                const response = await fetch("https://formspree.io/f/xwpoqvgv", {
                    method: "POST",
                    body: formData,
                    headers: {
                        Accept: "application/json",
                    },
                });

                if (response.ok) {
                    showToast("Thank you! Your project inquiry was sent to Nathnael.");
                    inquiryForm.reset();
                    // Reset estimator state
                    calculateEstimate();
                } else {
                    showToast("There was an issue sending your message. Please try again.", "error");
                }
            } catch (err) {
                showToast("Network error. Please email nathanelnigussie19@gmail.com directly.", "error");
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtn;
            }
        });
    }
});
