// === STANDARD MODERN JAVASCRIPT FOR LUMINA ATLAS (No Advanced APIs) ===

document.addEventListener('DOMContentLoaded', () => {
    // --- Element References (Using const for constants) ---
    const atlasGrid = document.getElementById('atlas-grid');
    const loadingIndicator = document.getElementById('loading-indicator');
    const modalContainer = document.getElementById('modal-container');
    const modalDialog = modalContainer?.querySelector('.modal-dialog');
    const modalContent = modalContainer?.querySelector('.modal-content');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalTitle = document.getElementById('modal-title');
    const modalImage = document.getElementById('modal-image');
    const modalDescription = document.getElementById('modal-description');
    const modalFacts = document.getElementById('modal-facts');
    const filterButtons = document.querySelectorAll('#filter-nav button');
    const currentYearSpan = document.getElementById('current-year');
    const particleContainer = document.getElementById('particle-container');

    // --- Check Essential Elements ---
    // Ensures required elements are present before running script
    if (!atlasGrid || !loadingIndicator || !modalContainer || !modalCloseBtn || !currentYearSpan || !particleContainer) {
        console.error("LUMINA Atlas Error: Essential HTML elements are missing! Script halted.");
        return;
    }

    // --- Initial Setup ---

    // Set current year using standard Date object
    currentYearSpan.textContent = new Date().getFullYear();

    // Hide loader after a short delay (Standard practice for visual flow)
    setTimeout(() => {
        loadingIndicator.classList.add('hidden');
    }, 500);

    // --- Simple Particle Generation (Modern JS loop & randomization) ---
    function createParticles() {
        const particleCount = 75;
        const glowColors = ['var(--glow-primary)', 'var(--glow-secondary)', 'var(--glow-tertiary)', 'var(--glow-white)'];
        // Use DocumentFragment for performance when adding many elements
        const fragment = document.createDocumentFragment();

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';

            // Standard Math.random() for variations
            const size = Math.random() * 3 + 1;
            const glowColor = glowColors[Math.floor(Math.random() * glowColors.length)];
            const duration = Math.random() * 15 + 10;
            const delay = Math.random() * -duration; // Negative delay starts animation partway through
            const startOpacity = Math.random() * 0.4 + 0.2;
            const startX = Math.random() * 100;
            const startY = Math.random() * 100;
            const xDriftStart = `${(Math.random() - 0.5) * 10}px`;
            const xDriftEnd = `${(Math.random() - 0.5) * 20}px`;

            // Set styles using CSS variables (modern approach)
            particle.style.setProperty('--size', `${size}px`);
            particle.style.setProperty('--glow-color', glowColor);
            particle.style.setProperty('--duration', `${duration}s`);
            particle.style.setProperty('--delay', `${delay}s`);
            particle.style.setProperty('--start-opacity', startOpacity);
            particle.style.setProperty('--x-drift-start', xDriftStart);
            particle.style.setProperty('--x-drift-end', xDriftEnd);
            // Use transform for initial positioning if possible, or fallback to left/top
            particle.style.left = `${startX}%`;
            particle.style.top = `${startY}%`;

            fragment.appendChild(particle); // Add to fragment
        }
        particleContainer.appendChild(fragment); // Append fragment once
    }

    // --- Dynamic Content Generation (Using createElement - Standard/Safe) ---
    function createOrganismCard(organism) {
        // Create elements using standard DOM methods
        const card = document.createElement('article');
        card.className = 'organism-card';
        card.dataset.id = organism.id;
        card.dataset.category = organism.category;
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-label', `View details for ${organism.name}`);
        card.dataset.animated = 'false'; // Flag for scroll animation check

        const cardInner = document.createElement('div');
        cardInner.className = 'card-inner';

        const imgWrapper = document.createElement('div');
        imgWrapper.className = 'card-image-wrapper';
        const img = document.createElement('img');
        img.src = organism.imageSrc;
        img.alt = `Bioluminescent ${organism.name}`;
        img.loading = 'lazy'; // Modern lazy loading attribute
        img.width = 300; // Provide intrinsic size hint
        img.height = 240;
        imgWrapper.appendChild(img);

        const cardContent = document.createElement('div');
        cardContent.className = 'card-content';
        const heading = document.createElement('h3');
        heading.textContent = organism.name;
        const shortDesc = document.createElement('p');
        shortDesc.textContent = organism.description_short;
        cardContent.appendChild(heading);
        cardContent.appendChild(shortDesc);

        const glowBorder = document.createElement('div');
        glowBorder.className = 'card-glow-border';

        cardInner.appendChild(imgWrapper);
        cardInner.appendChild(cardContent);
        cardInner.appendChild(glowBorder);
        card.appendChild(cardInner);

        // --- Event Listeners (Standard Practice) ---
        card.addEventListener('click', () => openModal(organism));
        card.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openModal(organism);
            }
        });

        return card;
    }

    // Populate the grid
    function populateGrid() {
        atlasGrid.innerHTML = ''; // Clear grid
        const fragment = document.createDocumentFragment(); // Use fragment for efficiency
        organisms.forEach(organism => {
            const card = createOrganismCard(organism);
            fragment.appendChild(card);
        });
        atlasGrid.appendChild(fragment); // Append all cards at once
        // IMPORTANT: Check card visibility on initial load *after* populating
        checkCardsVisibility();
    }

    // --- Modal Functionality (Standard DOM updates & Class Toggles) ---
    let currentlyFocusedElement = null; // Variable declared with let (ES6+)

    function openModal(organism) {
        currentlyFocusedElement = document.activeElement; // Standard way to get focused element

        modalTitle.textContent = organism.name;
        modalImage.src = organism.imageSrc;
        modalImage.alt = `Detailed view of ${organism.name}`;
        modalDescription.textContent = organism.description_long;

        // Populate facts using standard DOM methods
        modalFacts.innerHTML = '';
        const factsList = document.createElement('ul');
        // Use modern `for...of` or `Object.entries` if preferred, `for...in` is standard but needs hasOwnProperty check usually
        for (const key in organism.facts) {
            // Ensure it's own property, not from prototype chain (good practice)
            if (Object.prototype.hasOwnProperty.call(organism.facts, key)) {
                const listItem = document.createElement('li');
                const strong = document.createElement('strong');
                // Format key nicely using standard string methods
                strong.textContent = `${key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}: `;
                listItem.appendChild(strong);
                // Use createTextNode for safety against XSS if data isn't trusted
                listItem.appendChild(document.createTextNode(organism.facts[key]));
                factsList.appendChild(listItem);
            }
        }
        modalFacts.appendChild(factsList);

        // Set data attribute for CSS targeting (e.g., Anglerfish SVG)
        modalContent.dataset.interactiveId = organism.id;

        // Show Modal (Standard class toggle)
        modalContainer.classList.add('is-visible');
        modalContainer.setAttribute('aria-hidden', 'false');

        // Manage Focus (Standard Accessibility Practice)
        setTimeout(() => modalCloseBtn.focus(), 100);
    }

    function closeModal() {
        modalContainer.classList.remove('is-visible');
        modalContainer.setAttribute('aria-hidden', 'true');
        modalContent.removeAttribute('data-interactive-id');
        if (currentlyFocusedElement) {
            currentlyFocusedElement.focus(); // Restore focus
            currentlyFocusedElement = null;
        }
    }

    // Standard Modal Event Listeners
    modalCloseBtn.addEventListener('click', closeModal);
    modalContainer.addEventListener('click', (event) => {
        if (event.target === modalContainer) closeModal(); // Close on backdrop click
    });
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modalContainer.classList.contains('is-visible')) closeModal();
    });

    // --- Filtering (Standard JS - Toggles attribute on grid) ---
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filterValue = button.dataset.filter;
            // Update button states (Standard class/attribute manipulation)
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-pressed', 'false');
            });
            button.classList.add('active');
            button.setAttribute('aria-pressed', 'true');
            // Update grid data attribute - CSS handles the filtering visually
            atlasGrid.dataset.activeFilter = filterValue;
             // After filtering, re-check visibility in case layout changed
            checkCardsVisibility();
        });
    });

    // --- Scroll Animation Trigger (NO IntersectionObserver - Standard JS Approach) ---
    let throttleTimer = false; // Timer for throttling scroll events

    // Function to check which cards are in view
    function checkCardsVisibility() {
        // Select only cards that haven't been animated yet
        const cardsToCheck = atlasGrid.querySelectorAll('.organism-card[data-animated="false"]');
        const viewportHeight = window.innerHeight;

        cardsToCheck.forEach(card => {
            const cardRect = card.getBoundingClientRect(); // Standard method to get position
            // Check if the top of the card is within, say, 90% of the viewport height
            if (cardRect.top < viewportHeight * 0.90) {
                card.dataset.animated = 'true'; // Mark as animated
                // CSS transition/animation handles the visual change based on this attribute
                // Note: The CSS needs to be updated to use [data-animated="true"] instead of .is-visible
                // Or we can add the .is-visible class here:
                // card.classList.add('is-visible');
            }
        });
    }

    // Throttled scroll handler function
    const throttledScrollHandler = () => {
        if (!throttleTimer) { // Only run if timer is not active
            throttleTimer = true; // Set timer active
            setTimeout(() => {
                checkCardsVisibility(); // Run the visibility check
                throttleTimer = false; // Reset timer after delay
            }, 200); // Throttle check to run max every 200ms
        }
    };

    // Standard scroll event listener
    window.addEventListener('scroll', throttledScrollHandler);

    // --- Initial Load Calls ---
    createParticles(); // Generate background particles
    populateGrid(); // Create cards and ALSO does initial visibility check

}); // End DOMContentLoaded
