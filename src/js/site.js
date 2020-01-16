import "../sass/main.scss";
import icon from "../img/icon.png"
import { importFontAwesomeIcons } from "./font-awesome.setup.js";

// import "materialize-css"; //only JS, and we only use our customized material scss referenced in _app.scss (end of file)
import "./materialize-custom"; // we use a custom grunt.js file for the custom build --> downloads/materialize repo
import PerfectScrollbar from 'perfect-scrollbar';
import screenfull from 'screenfull';


var allCollapsibleInstancesInSidebar;
var sidebarCollapsibles;
var fixedHeaderCb;
var fixedNavCb;
var minifiedNavCb;
var mobileNavCb;
var sideNavHideShowButton;
var elSidenav;
var elAside;
var body;
var allLinksInSidebar;
var elSettingsPanel;
var btnFullscreen;

var $ = document.querySelector.bind(document);
var $$ = document.querySelectorAll.bind(document);

function forTestingStuff() {
    var elems = $$('.content-page .collapsible');
    var instances = M.Collapsible.init(elems, {});
}

// core site setup
export function setup() {

    importFontAwesomeIcons();
  
    queryControls();

    forTestingStuff(); // testing, can be removed later

    var mq768px = window.matchMedia("(max-width: 600px)"); // 768px
    mqMinWidth768pxHandler(mq768px) // Call listener function at run time
    mq768px.addListener(mqMinWidth768pxHandler) // Attach listener function on state changes

    initSettingsPanel();
    initNavigationSidebar();

    allLinksInSidebar.forEach(a => a.addEventListener("click", function (e) { e.preventDefault(); })); // temporary   

    if (!hasTouch()) {
        body.classList.add("jm-no-touch");
    }

}

function mqMinWidth768pxHandler(mq) {

    // console.log(mq);
    if (mq.matches) { // If media query matches
        document.body.classList.add("minified-nav");
        destroyCollapsibles();
        console.log("destroyCollapsibles");
    } else {
        document.body.classList.remove("minified-nav");
        activateCollapsibles();
        console.log("activateCollapsibles");
    }
}


function hasTouch() {
    var match = window.matchMedia || window.msMatchMedia;
    if (match) {
        var mq = match("(pointer:coarse)");
        return mq.matches;
    }
    return false;
}


function initSettingsPanel() {

    let cssClassFixedHeader = "fixed-header";
    let cssClassFixedNavigation = "fixed-navigation";
    let cssClassMinifiedNavigation = "minified-nav";

    $("#site-settings").addEventListener("click", () => {
        if (!isSidebarHidden()) { // clears the sidebar transformation style (open/close) to prevent jumping when activating fixed-header
            elSidenav.style.transition = "";
            elSidenav.style.transform = "";
        }
    });

    $(".settings-overlay").addEventListener("click", function (e) {
        //  e.preventDefault(); 
        let isOverlay = event.target.classList.contains('settings-overlay');
        isOverlay && toggleSettingsPanel();
    });

    if (!screenfull.isEnabled) {
        // https://github.com/sindresorhus/screenfull.js#detect-fullscreen-change
        $(".fullscreen").style.display = "none";
    }

    btnFullscreen.addEventListener("click", toggleFullScreen);

    fixedHeaderCb.addEventListener("click", function () {
        if (this.checked) {
            body.classList.add(cssClassFixedHeader);
        } else {
            body.classList.remove(cssClassFixedHeader, cssClassFixedNavigation);
            fixedNavCb.checked = false;
            destroyScrollbar();
        }
    });

    fixedNavCb.addEventListener("click", function () {

        if (this.checked) {
            fixedHeaderCb.checked = true;
            body.classList.add(cssClassFixedHeader, cssClassFixedNavigation);
            createScrollbar();
        } else {
            destroyScrollbar();
            body.classList.remove(cssClassFixedNavigation);
        }
    });

    minifiedNavCb.addEventListener("click", function () {
        if (this.checked) {
            body.classList.add(cssClassMinifiedNavigation);

            if (mobileNavCb.checked && isSidebarHidden()) {
                hideSidebar(true);
            }

            destroyCollapsibles();
            ps && ps.update();
        } else {

             
            body.classList.remove(cssClassMinifiedNavigation);

            if (mobileNavCb.checked && isSidebarHidden()) {
                hideSidebar(true);
            }
            activateCollapsibles();
        }
    });


    var _hideSidebar = () => { hideSidebar(true); };
    var _showSidebar = () => { hideSidebar(false); };

    mobileNavCb.addEventListener("click", function () {

        if (this.checked) {
            body.classList.add("mobile-nav");

            // !isSidebarHidden() && hideSidebar(true);
            hideSidebar(true);

            elSidenav.addEventListener("mouseenter", _showSidebar);
            elSidenav.addEventListener("mouseleave", _hideSidebar);
           
            document.addEventListener('touchstart', hideNavIfTouchOutside, { passive: true });

        } else {
            body.classList.remove("mobile-nav");
            elSidenav.removeEventListener("mouseenter", _showSidebar);
            elSidenav.removeEventListener("mouseleave", _hideSidebar);
            hideSidebar(false);

            document.removeEventListener('touchstart', hideNavIfTouchOutside, { passive: true });
        }
    })

    toggleSettingsPanel();

    // let initializedSettings = false;
    function toggleSettingsPanel() {

        let classHidden = "transformSettingsHidden";
        let classVisible = "transformSettingsVisible";

        let isSettingsSidebarClosed = elSettingsPanel.classList.contains(classHidden);

        elSettingsPanel.classList.remove(isSettingsSidebarClosed ? classHidden : classVisible);
        elSettingsPanel.classList.add(isSettingsSidebarClosed ? classVisible : classHidden);

        isSettingsSidebarClosed ? body.classList.add("body-hidden") : body.classList.remove("body-hidden");

        minifiedNavCb.checked = isSettingsSidebarClosed && body.classList.contains(cssClassMinifiedNavigation);
        // make it true if we are already in minified view
    }

    // Can be used to make the page not scrollable while settings is open
    // if (!hasClassHidden) {
    //     body.classList.remove("body-hidden");
    // } else {
    //     body.classList.add("body-hidden");
    // }

    $$("#btn-settings,#btnClose").forEach((el) => { el.addEventListener("click", toggleSettingsPanel); });
}

function queryControls() {

    allLinksInSidebar = $$("#mobile-navbar a");
    elSettingsPanel = $("#site-settings");
    fixedHeaderCb = $("#fixedHeader");
    fixedNavCb = $("#fixedNav");
    minifiedNavCb = $("#minifiedNav");
    mobileNavCb = $("#mobileNav");
    sideNavHideShowButton = $("#sidenav-trigger");
    elSidenav = $('.sidenav');
    sidebarCollapsibles = $$("#" + elSidenav.id + ' .collapsible');
    body = $("body");
    btnFullscreen = $("#toggleFullScreen");
    elAside = $("aside");
}

function destroyCollapsibles() {
    sidebarCollapsibles && sidebarCollapsibles.forEach((c) => {
        c && c.M_Collapsible && c.M_Collapsible.destroy();
    });
}

function activateCollapsibles() {
    allCollapsibleInstancesInSidebar = M.Collapsible.init(sidebarCollapsibles, { accordion: false });
}

function isSidebarHidden() {
    return body.classList.contains("nav-hidden");
}

function isMobileNav() {
    return body.classList.contains("mobile-nav");
}

function isMinifiedNav() {
    return body.classList.contains("minified-nav");
}

function isSidebarFixed() {
    return body.classList.contains("fixed-navigation");
}

function toggleFullScreen(e) {
    if (screenfull.isEnabled) {
        var doc = window.document;
        var docEl = doc.documentElement;
        screenfull.toggle(docEl);
    }
}


function hideSidebar(shouldHide) {
    console.log("hidesidebar: " + shouldHide);
    if (shouldHide) {
        body.classList.add("nav-hidden");

        elAside.style.transition = "all .4s ease-in-out";

        // let translateX = isMobileNav() ? (isMinifiedNav() ? "translateX(-92%)" : "translateX(-98%)") : "translateX(-105%)";
        let translateX = isMobileNav() ? (isMinifiedNav() ? "translateX(-50px)" : "translateX(-230px)") : "translateX(-105%)";

        console.log("translateX: " + translateX);

        elAside.style.transform = translateX; // isMobileNav() ? "translateX(-98%)" : "translateX(-105%)";
    } else {
        body.classList.remove("nav-hidden");
        elAside.style.transition = "all .4s ease-in-out ";
        elAside.style.transform = "translateX(0%)";
    }
}


var ps = null;

function destroyScrollbar() {
    ps && ps.destroy();
    ps = null;
}

function createScrollbar() {

    if (ps == null) {
        window.ps = ps = new PerfectScrollbar('.sidenav', {
            wheelSpeed: 1,
            // if true, when the scroll reaches the end of the side, mousewheel event will be propagated to parent element.
            wheelPropagation: false,
            minScrollbarLength: 20,
            suppressScrollX: true
        });
    }

    return ps;
}

// inDuration=250
// outDuration=200
function initNavigationSidebar() {

   
    sideNavHideShowButton.addEventListener("click", function (e) {
        e.preventDefault(); // prevent content-page to jump up to beginning on toggle sidebar

        if (!isSidebarHidden()) {
            hideSidebar(true);
        } else {
            hideSidebar(false);
        }
    });

    // elSidenav.addEventListener('ps-scroll-y', () => console.log("y"));
    elSidenav.addEventListener("dragstart", () => {
        console.log("dragstart");
    });

    elSidenav.addEventListener("touchstart", function (e) {
        if (isMobileNav() && isSidebarHidden()) {
            hideSidebar(false);
            // e.preventDefault();
        }
    }, { passive: true });

    const allDropdowns = $$("header .dropdown-trigger", ".content-page .dropdown-trigger");
    const instancesDropdown = window.instancesDropdown = M.Dropdown.init(allDropdowns, {
        coverTrigger: false,
        constrainWidth: false,
        hover: false
    });

    var ddl;
    var mouseoutListener = function () {
        ddl.close();
    };
    // we close the ddl on desktop when mouse leaves ddl
    $("#profile-dropdown").addEventListener("mouseleave", mouseoutListener);

    ddl = M.Dropdown.init($("#aJM"), { hover: false, constrainWidth: false });

}

function hideNavIfTouchOutside(e) {
    // console.log(event.target);
    if (isMobileNav() && !isSidebarHidden()) {
        if (elSidenav !== event.target && !elSidenav.contains(event.target)) { // or use: event.target.closest(selector) === null
            console.log("outside");
            hideSidebar(true);
        }
    }
}
 