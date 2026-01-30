chrome.storage.local.get(null, (data) => {
    if (data.extensionState) {
        const selectorsToRemove = []
        // ===== GENERAL =====
        if (data.adblock) {
            // adblock
            const ads = Array.from(document.querySelectorAll('div.banner.banner-950.js-hide-in-app, div.banner.banner-250.js-hide-in-app, div.banner.banner-230.js-hide-in-app')).filter(ad =>
                ad.querySelector('a[href="/pro/?utm_medium=banner&utm_campaign=get-pro"]')
            )
            ads.forEach(ad => ad.remove())
            document.querySelectorAll(".upgrade-kicker").forEach(kicker => kicker.remove())

            // remove patron ad on film page
            const filmPagePatronAdObserver = new MutationObserver((_, observer) => {
                const link = Array.from(document.querySelectorAll("#userpanel a")).find(a => a.href.includes("/pro/"))
                if (link) {
                    link.closest("li").remove()
                    observer.disconnect()
                }
            })
            filmPagePatronAdObserver.observe(document.body, {childList: true, subtree: true})

            // activity settings ad remove & padding consistency
            selectorsToRemove.push("#content > div > div > aside > section.activity-settings.js-activity-filters.pro-message > form > small")
            const activitySettingsForm = document.querySelector("#content > div > div > aside > section.activity-settings.js-activity-filters.pro-message > form")
            if (activitySettingsForm) activitySettingsForm.style.paddingBottom = 0
            const activitySettingsBtn1 = document.querySelector("#content > div > div > aside > section.activity-settings.js-activity-filters.pro-message > form > label:nth-child(1)")
            if (activitySettingsBtn1) activitySettingsBtn1.style.paddingTop = "12px"
            const activitySettingsBtn2 = document.querySelector("#content > div > div > aside > section.activity-settings.js-activity-filters.pro-message > form > label.option-label.-toggle.-small.switch-control.-block.-highcontrast.divider")
            if (activitySettingsBtn2) activitySettingsBtn2.style.borderBottom = "none"
        }

        // ===== FILM PAGE =====
        if (data.hideJustWatch) {
            // where to watch – remove the parent if not streaming
            const justWatchObserver = new MutationObserver((_, observer) => {
                const justWatchMessage = document.querySelector("#watch > div.other.-message")
                if (justWatchMessage) {
                    if (justWatchMessage.innerHTML.trim() == "Not streaming.") {
                        if (window.location.href.startsWith("https://letterboxd.com/film/")) {
                            document.querySelector("#js-poster-col > section.watch-panel.js-watch-panel > div.header").remove()
                            document.querySelector("#js-poster-col > section.watch-panel.js-watch-panel").remove()
                        } else {
                            document.querySelector("#content > div > div > section > div.col-4.gutter-right-1 > section.watch-panel.js-watch-panel").remove()
                        }
                    } else document.querySelector("#watch > div.other.-message").remove()
                }
            })
            justWatchObserver.observe(document.body, {childList: true, subtree: true})
        }

        if (data.hideNews) {
            selectorsToRemove.push("#film-page-wrapper > div.col-17 > section.section-margin.film-news")
        }

        if (data.hideMentionedBy) {
            selectorsToRemove.push("#film-hq-mentions")
        }
        
        // make reviews & network page wider
        if ((window.location.href.endsWith("/reviews/") && !window.location.href.includes("film")) || window.location.href.endsWith("/following/")) {
            if (data.reviewsPageWider) {
                const reviews = document.querySelector("#content > div > section.section.col-main.overflow.col-17")
                if (reviews) reviews.style.width = "100%"
            }
            if (data.networkPageWider) {
                const network = document.querySelector("#content > div > div > section")
                if (network) network.style.width = "100%"
            }
        }

        // people pages consistent border-radius
        peopleShare = document.querySelector("#userpanel > ul > li")
        if (peopleShare) peopleShare.style.borderRadius = "3px"

        // remove selectors
        selectorsToRemove.forEach(selector => {
            const observer = new MutationObserver((_, observer) => {
                const selectorHTML = document.querySelector(selector)
                if (selectorHTML) {
                    selectorHTML.remove()
                    observer.disconnect()
                }
            })
            observer.observe(document.body, {childList: true, subtree: true})
        })
    }
})