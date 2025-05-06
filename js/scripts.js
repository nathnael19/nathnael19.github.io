// DOM Elements
const hamburger = document.querySelector(".hamburger")
const navLinks = document.querySelector(".nav-links")
const themeToggle = document.querySelector(".theme-toggle")
const filterBtns = document.querySelectorAll(".filter-btn")
const projectCards = document.querySelectorAll(".project-card")
const contactForm = document.getElementById("contactForm")
const navItems = document.querySelectorAll(".nav-links a")

// Toggle mobile menu
hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active")
    navLinks.classList.toggle("active")
})

// Close mobile menu when clicking on a nav item
navItems.forEach((item) => {
    item.addEventListener("click", () => {
        hamburger.classList.remove("active")
        navLinks.classList.remove("active")
    })
})

// Theme toggle
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode")

    // Update icon
    const icon = themeToggle.querySelector("i")
    if (document.body.classList.contains("dark-mode")) {
        icon.classList.remove("fa-moon")
        icon.classList.add("fa-sun")
        localStorage.setItem("theme", "dark")
    } else {
        icon.classList.remove("fa-sun")
        icon.classList.add("fa-moon")
        localStorage.setItem("theme", "light")
    }
})

// Check for saved theme preference
const savedTheme = localStorage.getItem("theme")
if (savedTheme === "dark") {
    document.body.classList.add("dark-mode")
    const icon = themeToggle.querySelector("i")
    icon.classList.remove("fa-moon")
    icon.classList.add("fa-sun")
}

// Project filtering
filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
        // Remove active class from all buttons
        filterBtns.forEach((btn) => btn.classList.remove("active"))

        // Add active class to clicked button
        btn.classList.add("active")

        const filter = btn.getAttribute("data-filter")

        projectCards.forEach((card) => {
            if (filter === "all" || card.getAttribute("data-category") === filter) {
                card.style.display = "block"
                setTimeout(() => {
                    card.style.opacity = "1"
                    card.style.transform = "scale(1)"
                }, 10)
            } else {
                card.style.opacity = "0"
                card.style.transform = "scale(0.8)"
                setTimeout(() => {
                    card.style.display = "none"
                }, 300)
            }
        })
    })
})

// Form submission
contactForm.addEventListener("submit", (e) => {
    e.preventDefault()

    // Get form values
    const name = document.getElementById("name").value
    const email = document.getElementById("email").value
    const subject = document.getElementById("subject").value
    const message = document.getElementById("message").value

    // Basic form validation
    if (!name || !email || !subject || !message) {
        alert("Please fill in all fields")
        return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
        alert("Please enter a valid email address")
        return
    }

    // In a real application, you would send this data to a server
    // For this example, we'll just log it and show a success message
    console.log({ name, email, subject, message })

    // Reset form
    contactForm.reset()

    // Show success message
    alert("Your message has been sent successfully!")
})

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault()

        const targetId = this.getAttribute("href")
        const targetElement = document.querySelector(targetId)

        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: "smooth",
            })
        }
    })
})

// Active navigation based on scroll position
window.addEventListener("scroll", () => {
    const scrollPosition = window.scrollY
    const header = document.querySelector("header")

    // Add shadow to header on scroll
    if (scrollPosition > 50) {
        header.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)"
    } else {
        header.style.boxShadow = "none"
    }

    // Update active navigation link
    const sections = document.querySelectorAll("section")

    sections.forEach((section) => {
        const sectionTop = section.offsetTop - 100
        const sectionHeight = section.offsetHeight
        const sectionId = section.getAttribute("id")

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            document.querySelector(".nav-links a.active")?.classList.remove("active")
            document.querySelector(`.nav-links a[href="#${sectionId}"]`)?.classList.add("active")
        }
    })
})

// Animation on scroll
const animateOnScroll = () => {
    const elements = document.querySelectorAll(".skill-item, .project-card, .contact-item")

    elements.forEach((element) => {
        const elementPosition = element.getBoundingClientRect().top
        const screenPosition = window.innerHeight / 1.2

        if (elementPosition < screenPosition) {
            element.style.opacity = "1"
            element.style.transform = "translateY(0)"
        }
    })
}

// Set initial styles for animation
document.querySelectorAll(".skill-item, .project-card, .contact-item").forEach((element) => {
    element.style.opacity = "0"
    element.style.transform = "translateY(20px)"
    element.style.transition = "opacity 0.5s ease, transform 0.5s ease"
})

// Run animation on load and scroll
window.addEventListener("load", animateOnScroll)
window.addEventListener("scroll", animateOnScroll)
