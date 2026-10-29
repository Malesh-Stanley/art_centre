/* =========================================================
   NOTOS ART CENTRE
   Main JavaScript
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  /* =======================================================
     1. HERO IMAGE CAROUSEL
     Bootstrap handles slide transitions and dotted controls.
     ======================================================= */

  const heroCarousel = document.querySelector("#notosHeroCarousel");

  if (heroCarousel && window.bootstrap) {
    bootstrap.Carousel.getOrCreateInstance(heroCarousel, {
      interval: 5000,
      pause: "hover",
      ride: "carousel",
      touch: true,
      wrap: true,
    });
  }

  /* =======================================================
     2. WEEKLY EVENTS
     Select a day to update the event details and image.
     ======================================================= */

  const weeklyEvents = {
    monday: {
      title: "Monday Kickoff Nights",
      tagline: "Start Strong",
      description:
        "Kick off the week with good music, a welcoming atmosphere and time to catch up with friends.",
      image: "img/monday.png",
      alt: "Monday Kickoff Nights at Notos Art Centre",
    },

    tuesday: {
      title: "Tuesday Mellow Catchup",
      tagline: "Relax & Reconnect",
      description:
        "Take a break from the busy week. Meet friends, unwind and enjoy a relaxed evening at Notos.",
      image: "img/tuesday.png",
      alt: "Tuesday Mellow Catchup at Notos Art Centre",
    },

    wednesday: {
      title: "Wednesday Ladies Night",
      tagline: "Midweek Celebration",
      description:
        "Make Wednesday a special evening with music, great company and a lively midweek atmosphere.",
      image: "img/wednesday.png",
      alt: "Wednesday Ladies Night at Notos Art Centre",
    },

    thursday: {
      title: "Thursday Original Karaoke",
      tagline: "With MC JOJO — Sing It Loud",
      description:
        "Take the microphone, sing your favourite songs and enjoy a night of music and entertainment.",
      image: "img/thursday.png",
      alt: "Thursday Original Karaoke at Notos Art Centre",
    },

    friday: {
      title: "Freaky Fridays",
      tagline: "Food, Friends & Fun",
      description:
        "Welcome the weekend with music, great company and an energetic Friday-night atmosphere.",
      image: "img/friday.png",
      alt: "Freaky Fridays at Notos Art Centre",
    },

    saturday: {
      title: "Saturday Football & Music",
      tagline: "Big Screens, Beers & Dancing",
      description:
        "Gather with friends for football, catch the match on the big screen and enjoy the evening entertainment.",
      image: "img/saturday.png",
      alt: "Saturday football and entertainment at Notos Art Centre",
    },

    sunday: {
      title: "Sunday Reggae Nights",
      tagline: "End the Week on a Soulful Note",
      description:
        "Round off the week with reggae rhythms, a relaxed atmosphere and good company.",
      image: "img/perfect.png",
      alt: "Sunday Reggae Nights at Notos Art Centre",
    },
  };

  const dayButtons = document.querySelectorAll("[data-event-day], [data-day]");

  const eventTitle = document.querySelector(
    "#featured-event-title, .featured-event-title",
  );

  const eventTagline = document.querySelector(
    "#featured-event-tagline, .featured-event-tagline",
  );

  const eventDescription = document.querySelector(
    "#featured-event-description, .featured-event-description",
  );

  const eventDay = document.querySelector("#featured-event-day");

  const eventImage = document.querySelector(
    "#featured-event-image, .featured-event-image",
  );

  const eventPanel = document.querySelector("#featured-event, .featured-event");

  function showEvent(day) {
    const event = weeklyEvents[day];

    if (!event) return;

    if (eventTitle) {
      eventTitle.textContent = event.title;
    }

    if (eventTagline) {
      eventTagline.textContent = event.tagline;
    }

    if (eventDescription) {
      eventDescription.textContent = event.description;
    }

    if (eventDay) {
      eventDay.textContent = day.toUpperCase();
    }

    if (eventImage) {
      eventImage.src = event.image;
      eventImage.alt = event.alt;
    }

    // Highlight the selected day for keyboard and screen readers.
    dayButtons.forEach(function (button) {
      const buttonDay = (
        button.dataset.eventDay ||
        button.dataset.day ||
        ""
      ).toLowerCase();

      const isActive = buttonDay === day;

      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    if (eventPanel) {
      eventPanel.classList.remove("event-changing");

      // Restart the CSS transition without a timer.
      void eventPanel.offsetWidth;

      eventPanel.classList.add("event-changing");
    }
  }

  dayButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const day = (
        button.dataset.eventDay ||
        button.dataset.day ||
        ""
      ).toLowerCase();

      showEvent(day);
    });
  });

  // Display the selected day on initial page load.
  const initiallySelectedDay = document.querySelector(
    "#event-date-navigation [data-event-day].active, " +
      ".event-day-btn.active[data-event-day], " +
      ".event-day-btn.active[data-day]",
  );

  const firstDay = initiallySelectedDay
    ? (
        initiallySelectedDay.dataset.eventDay ||
        initiallySelectedDay.dataset.day
      ).toLowerCase()
    : "monday";

  showEvent(firstDay);

  /* =======================================================
     3. MOBILE NAVIGATION
     Close the Bootstrap mobile menu after a section is chosen.
     ======================================================= */

  const navCollapse = document.querySelector("#mainNavigation");

  if (navCollapse && window.bootstrap) {
    const navLinks = navCollapse.querySelectorAll('a[href^="#"]');

    navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        if (navCollapse.classList.contains("show")) {
          bootstrap.Collapse.getOrCreateInstance(navCollapse, {
            toggle: false,
          }).hide();
        }

        /* Keep the navigation transparent over the hero and solid after scrolling. */
        const header = document.querySelector("#header");
        const updateHeader = function () {
          if (header) {
            header.classList.toggle("is-scrolled", window.scrollY > 24);
          }
        };

        updateHeader();
        window.addEventListener("scroll", updateHeader, { passive: true });
      });
    });
  }

  /* =======================================================
     4. SECTION REVEAL EFFECTS
     Add class="reveal" to sections or cards you want animated.
     ======================================================= */

  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
      },
    );

    revealElements.forEach(function (element) {
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach(function (element) {
      element.classList.add("is-visible");
    });
  }
});
