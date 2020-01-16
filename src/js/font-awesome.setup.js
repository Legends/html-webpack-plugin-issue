import { library, dom, config } from '@fortawesome/fontawesome-svg-core';
import { faFacebook, faTwitter, faYoutube, faInstagram, faPinterest, faLinkedinIn } from '@fortawesome/free-brands-svg-icons/';
import { faCog } from "@fortawesome/free-solid-svg-icons/";

export function importFontAwesomeIcons() {
    console.log(config.autoA11y);

    library.add(
        faPinterest, faLinkedinIn, faFacebook, faTwitter, faYoutube, faInstagram, faCog
    );

    // Replace any existing <i> tags with <svg> and set up a MutationObserver to
    // continue doing this as the DOM changes.
    dom.watch();

    // dom.i2svg()
    //   .then(function () {
    //     console.log('Icons have rendered')
    //   })
}
 