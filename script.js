/* 
   SARGAM CLUB RAJKOT - Premium JS Functionality
*/

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Preloader Hide ---
  const loader = document.getElementById('loader');
  if (loader) {
    window.addEventListener('load', () => {
      loader.classList.add('fade-out');
      // Enable scroll after preloader fades out
      setTimeout(() => {
        loader.style.display = 'none';
      }, 600);
    });
  }

  // --- 2. Scroll Progress Bar & Sticky Header ---
  const progressBar = document.getElementById('scroll-progress');
  const header = document.querySelector('.main-header');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        // Progress Bar
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercentage = scrollHeight > 0 ? (window.scrollY / scrollHeight) * 100 : 0;
        if (progressBar) {
          progressBar.style.width = `${scrollPercentage}%`;
        }

        // Sticky Header
        if (header) {
          if (window.scrollY > 50) {
            header.classList.add('scrolled');
          } else {
            header.classList.remove('scrolled');
          }
        }
        ticking = false;
      });
      ticking = true;
    }
  });

  // Active Nav Link on Scroll using high-performance IntersectionObserver
  const activeNavObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const currentId = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${currentId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0.1
  });

  sections.forEach(section => activeNavObserver.observe(section));


  // --- 3. Mobile Menu Toggle ---
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close menu when link is clicked
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  // --- 4. Hero Background Slideshow ---
  const slides = document.querySelectorAll('.hero-slide');
  let currentSlide = 0;

  if (slides.length > 1) {
    setInterval(() => {
      slides[currentSlide].classList.remove('active');
      currentSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide].classList.add('active');
    }, 6000);
  }

  // --- 5. Scroll Reveal (Timeline & Section Cards) ---
  const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Trigger once
      }
    });
  };

  const revealObserver = new IntersectionObserver(revealCallback, {
    root: null,
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  // Target items to reveal
  const timelineItems = document.querySelectorAll('.timeline-item');
  const revealCards = document.querySelectorAll('.about-card, .trustee-card, .achievement-card, .activity-card');
  
  timelineItems.forEach(item => revealObserver.observe(item));
  revealCards.forEach(card => {
    // Initialize standard cards to be hidden/ready to animate
    card.style.opacity = '0';
    card.style.transform = 'translateY(40px)';
    card.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
    revealObserver.observe(card);
  });

  // Inline styling trigger on viewport intersection
  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        cardObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealCards.forEach(card => cardObserver.observe(card));

  // --- 6. Animated Counter for Statistics ---
  const statsSection = document.getElementById('stats');
  const countElements = document.querySelectorAll('.stat-number');
  let countStarted = false;

  const countUp = (el) => {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const duration = 2000; // 2 seconds
    const stepTime = Math.abs(Math.floor(duration / target));
    let current = 0;
    
    // Smooth step sizing for larger numbers
    const increment = target > 500 ? Math.ceil(target / 100) : 1;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        el.textContent = target.toLocaleString('en-US') + (el.getAttribute('data-suffix') || '');
        clearInterval(timer);
      } else {
        el.textContent = current.toLocaleString('en-US') + (el.getAttribute('data-suffix') || '');
      }
    }, Math.max(stepTime, 15));
  };

  if (statsSection && countElements.length > 0) {
    const statsObserver = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && !countStarted) {
        countElements.forEach(el => countUp(el));
        countStarted = true;
        statsObserver.unobserve(statsSection);
      }
    }, { root: null, threshold: 0.3 });

    statsObserver.observe(statsSection);
  }

  // --- 7. Activities Filtering & Modals ---
  const filterBtns = document.querySelectorAll('.activities-filter .filter-btn');
  const activityCards = document.querySelectorAll('.activity-card');
  const activityModal = document.getElementById('activity-modal');

  // Filtering
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle button states
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      activityCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterVal === 'all' || category === filterVal) {
          card.style.display = 'block';
          // Fast stagger animation
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px) scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // Modal Open
  activityCards.forEach(card => {
    const readMore = card.querySelector('.activity-readmore');
    if (readMore) {
      readMore.addEventListener('click', () => {
        const title = card.getAttribute('data-title');
        const desc = card.getAttribute('data-full-desc');
        const imgUrl = card.getAttribute('data-image');
        const categoryLabel = card.getAttribute('data-category-label');
        const category = card.getAttribute('data-category');

        // Populate Modal Fields
        document.getElementById('modal-img').src = imgUrl;
        document.getElementById('modal-tag').className = `modal-tag tag-${category}`;
        document.getElementById('modal-tag').textContent = categoryLabel;
        document.getElementById('modal-title').textContent = title;
        document.getElementById('modal-text').innerHTML = desc;

        // Open Modal
        activityModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Stop body scrolling
      });
    }
  });

  // Close Activity Modal
  const modalClose = document.querySelector('.modal-close-btn');
  if (modalClose && activityModal) {
    modalClose.addEventListener('click', () => {
      activityModal.classList.remove('active');
      document.body.style.overflow = 'auto'; // Restore scroll
    });

    // Close on overlay click
    activityModal.addEventListener('click', (e) => {
      if (e.target === activityModal) {
        activityModal.classList.remove('active');
        document.body.style.overflow = 'auto';
      }
    });
  }

  // --- 8. Gallery Filter and Lightbox ---
  const galleryFilterBtns = document.querySelectorAll('.gallery-filter .filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');

  // Filter
  galleryFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      galleryFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filterVal === 'all' || category === filterVal) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // Lightbox Trigger
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('.gallery-img');
      const caption = item.getAttribute('data-caption');
      
      if (lightboxModal && lightboxImg && lightboxCaption) {
        lightboxImg.src = img.src;
        lightboxCaption.textContent = caption;
        lightboxModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  // Close Lightbox
  const lightboxClose = lightboxModal ? lightboxModal.querySelector('.modal-close-btn') : null;
  if (lightboxClose && lightboxModal) {
    lightboxClose.addEventListener('click', () => {
      lightboxModal.classList.remove('active');
      document.body.style.overflow = 'auto';
    });

    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        lightboxModal.classList.remove('active');
        document.body.style.overflow = 'auto';
      }
    });
  }

  // --- 9. Contact Form Client-side Validation ---
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('formName').value.trim();
      const phone = document.getElementById('formPhone').value.trim();
      const email = document.getElementById('formEmail').value.trim();
      const subject = document.getElementById('formSubject').value.trim();
      const message = document.getElementById('formMessage').value.trim();

      if (!name || !phone || !email || !subject || !message) {
        alert('કૃપા કરીને બધી વિગતો ભરો. (Please fill all fields.)');
        return;
      }

      // Basic Phone validation
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(phone.replace(/\s+/g, ''))) {
        alert('કૃપા કરીને યોગ્ય ૧૦ આંકડાનો મોબાઈલ નંબર દાખલ કરો. (Please enter a valid 10-digit mobile number.)');
        return;
      }

      // Basic Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        alert('કૃપા કરીને યોગ્ય ઈમેલ એડ્રેસ દાખલ કરો. (Please enter a valid email address.)');
        return;
      }

      // Success Display
      alert(`થેન્ક યુ, ${name}!\nતમારો સંદેશો સફળતાપૂર્વક મોકલવામાં આવ્યો છે. અમે ટૂંક સમયમાં તમારો સંપર્ક કરીશું.\n\nThank you! Your message has been sent successfully. We will contact you soon.`);
      contactForm.reset();
    });
  }
});
