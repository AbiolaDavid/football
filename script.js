document.addEventListener('DOMContentLoaded', function() {
    // --- A. STREAM LINK TEST ---
    const streamPlayer = document.getElementById('football-stream-player');
    const streamFallback = document.getElementById('stream-fallback');
    const streamUrl = 'https://tgyh.kora1goal.com/albaplayer/sports-1/?autoplay=1&mute=1';

    function testStreamLink() {
        fetch(streamUrl, { method: 'HEAD', mode: 'no-cors' })
            .then(response => {
                // Note: no-cors mode returns an opaque response, so we can't reliably check status
                // If fetch succeeds, assume the link is available
                streamPlayer.style.display = 'block';
                streamFallback.style.display = 'none';
            })
            .catch(error => {
                console.warn('Stream link is offline:', error);
                streamPlayer.style.display = 'none';
                streamFallback.style.display = 'flex';
            });
    }

    // Test stream link on page load
    testStreamLink();

    // --- B. CONTACT MODAL LOGIC ---
    const adContactLink = document.getElementById('ad-contact-link');
    const contactModal = document.getElementById('contact-modal');
    const closeButton = document.querySelector('.close-btn');
    const focusableElements = contactModal?.querySelectorAll('button, [href], input, textarea, [tabindex]:not([tabindex="-1"])');
    const firstFocusableElement = focusableElements?.[0];
    const lastFocusableElement = focusableElements?.[focusableElements.length - 1];

    function showModal(event) {
        event.preventDefault();
        if (contactModal) {
            contactModal.style.display = 'flex';
            firstFocusableElement?.focus();
        }
    }

    function hideModal() {
        if (contactModal) {
            contactModal.style.display = 'none';
            adContactLink?.focus();
        }
    }

    function trapFocus(event) {
        if (event.key === 'Tab') {
            if (event.shiftKey) {
                if (document.activeElement === firstFocusableElement) {
                    event.preventDefault();
                    lastFocusableElement?.focus();
                }
            } else {
                if (document.activeElement === lastFocusableElement) {
                    event.preventDefault();
                    firstFocusableElement?.focus();
                }
            }
        }
    }

    if (adContactLink) {
        adContactLink.addEventListener('click', showModal);
    }

    if (closeButton) {
        closeButton.addEventListener('click', hideModal);
        closeButton.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                hideModal();
            }
        });
    }

    if (contactModal) {
        contactModal.addEventListener('click', (event) => {
            if (event.target === contactModal) {
                hideModal();
            }
        });
        contactModal.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                hideModal();
            }
            trapFocus(event);
        });
    }

    // --- C. AD ANIMATION LOGIC (Two-Iframe Fade for Both Sidebars) ---
    const iframeARight = document.getElementById('animated-ad-iframe-a');
    const iframeBRight = document.getElementById('animated-ad-iframe-b');
    const iframeALeft = document.getElementById('animated-ad-iframe-a-left');
    const iframeBLeft = document.getElementById('animated-ad-iframe-b-left');
    const adUrls = [
        "https://www.canva.com/design/DAG2aOdfxpw/pxxL0A6I268uJ54awYI4ZQ/view?embed",
        "https://www.canva.com/design/DAG2bYXTM-M/PL7f8xB-zHQ25oVW4zLugw/view?embed"
    ];
    const adUrlsLeft = [
        "https://www.canva.com/design/DAG2lrYdFQs/vU8_vmKb1Yw5XNRtsCZLkA/view?embed",
        "https://www.canva.com/design/DAG2jIHMmaI/cvPcN6A8wAl0z5R7QC8m_g/view?embed"
    ];

    if (!iframeARight || !iframeBRight || !iframeALeft || !iframeBLeft) {
        console.warn('Warning: One or more ad iframes not found. Ad rotation disabled.');
        return;
    }

    // Set initial sources for both sets of iframes
    iframeARight.src = adUrls[0];
    iframeBRight.src = adUrls[1];
    iframeALeft.src = adUrlsLeft[0];
    iframeBLeft.src = adUrlsLeft[1];

    let isAdACurrentlyVisible = true;
    const adIntervalTime = 15000;

    function cycleAd() {
        if (isAdACurrentlyVisible) {
            iframeARight.style.opacity = '0';
            iframeBRight.style.opacity = '1';
            iframeALeft.style.opacity = '0';
            iframeBLeft.style.opacity = '1';
        } else {
            iframeARight.style.opacity = '1';
            iframeBRight.style.opacity = '0';
            iframeALeft.style.opacity = '1';
            iframeBLeft.style.opacity = '0';
        }
        isAdACurrentlyVisible = !isAdACurrentlyVisible;
    }

    setInterval(cycleAd, adIntervalTime);

    // --- D. LATEST NEWS LOGIC ---
    const newsList = document.getElementById('news-list');
    if (!newsList) {
        console.warn('Warning: News list element not found (ID: news-list).');
        return;
    }

    const latestNews = [
        { headline: "All 10 Serie A games weekend predictions - Week 7.", link: "https://www.livescore.com/en/news/football/serie-a/predictions/serie-a-predictions-week-7/" },
        { headline: "ll 10 LaLiga games weekend predictions - Week 9.", link: "https://www.https://livescore.com/en/news/predictions/laliga-predictions-week-9/" },
        { headline: "All 10 Premier League weekend predictions - Week 8.", link: "https://https://www.livescore.com/en/news/football/premier-league/predictions/all-10-premier-league-weekend-predictions-week-8/" },
        { headline: "CSouthampton vs Swansea predictions", link: "https://ehttps://www.livescore.com/en/news/football/england-championship/predictions/southampton-swansea-predictions-saints-to-suffer-another-setback/" },
        { headline: "Arne Slot under pressure.", link: "https://www.skysports.com/liverpool" }
    ];

    let htmlContent = '';
    latestNews.forEach(item => {
        htmlContent += `
            <li onclick="window.location.href='${item.link}';" title="${item.headline}" role="link" tabindex="0">
                <i class="fas fa-bolt"></i> ${item.headline}
            </li>
        `;
    });

    newsList.innerHTML = htmlContent;

    newsList.querySelectorAll('li').forEach(item => {
        item.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                window.location.href = item.getAttribute('onclick').match(/'([^']+)'/)[1];
            }
        });
    });

    // --- E. CONTACT FORM SUBMISSION ---
    const contactForm = document.querySelector('#contact-modal form');
    if (contactForm) {
        contactForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const email = contactForm.querySelector('#email').value;
            const phone = contactForm.querySelector('#phone').value;
            const message = contactForm.querySelector('#message').value;
            console.log('Form submitted:', { email, phone, message });
            hideModal();
        });
    }
});