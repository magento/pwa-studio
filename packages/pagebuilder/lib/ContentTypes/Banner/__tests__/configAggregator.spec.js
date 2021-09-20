import configAggregator from '../configAggregator';

test('banner config aggregator retrieves default values from empty banner content type', () => {
    const node = document.createElement('div');
    node.innerHTML =
        '<div data-content-type="banner" data-appearance="poster" data-show-button="never" data-show-overlay="never" data-element="main" style="margin: 0px;"><div data-element="empty_link"><div class="pagebuilder-banner-wrapper" data-background-images="{}" data-element="wrapper" style="background-position: left top; background-size: cover; background-repeat: no-repeat; background-attachment: scroll; border-style: none; border-width: 1px; border-radius: 0px;"><div class="pagebuilder-overlay pagebuilder-poster-overlay" data-overlay-color="" data-element="overlay" style="border-radius: 0px; min-height: 300px; background-color: transparent; padding: 40px;"><div class="pagebuilder-poster-content"><div data-element="content"></div></div></div></div></div></div>';
    expect(
        configAggregator(node.childNodes[0], {
            appearance: 'poster'
        })
    ).toEqual(
        expect.objectContaining({
            backgroundAttachment: 'scroll',
            backgroundPosition: 'left top',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            border: 'none',
            borderColor: '',
            borderRadius: '0px',
            borderWidth: '1px',
            buttonText: null,
            buttonType: null,
            content: '',
            cssClasses: [],
            desktopImage: null,
            link: null,
            linkType: null,
            marginBottom: '0px',
            marginLeft: '0px',
            marginRight: '0px',
            marginTop: '0px',
            minHeight: '300px',
            mobileImage: null,
            overlayColor: null,
            paddingBottom: '40px',
            paddingLeft: '40px',
            paddingRight: '40px',
            paddingTop: '40px',
            showButton: 'never',
            showOverlay: 'never',
            textAlign: ''
        })
    );
});

test('banner config aggregator retrieves values from fully configured poster banner content type', () => {
    const node = document.createElement('div');
    node.innerHTML =
        '<div data-content-type="banner" data-appearance="poster" data-show-button="always" data-show-overlay="never" data-element="main" style="margin: 0px;"><a href="gear/bags.html" target="_blank" data-link-type="category" data-element="link"><div class="pagebuilder-banner-wrapper" data-background-images="{\\&quot;desktop_image\\&quot;:\\&quot;desktop-image.jpg\\&quot;,\\&quot;mobile_image\\&quot;:\\&quot;mobile-image.jpg\\&quot;}" data-element="wrapper" style="background-color: blue; background-position: center center; background-size: cover; background-repeat: no-repeat; background-attachment: scroll; border-style: none; border-width: 1px; border-radius: 0px;"><div class="pagebuilder-overlay pagebuilder-poster-overlay" data-overlay-color="rgba(255, 255, 255, 0.25)" data-element="overlay" style="border-radius: 0px; min-height: 300px; background-color: transparent; padding: 40px;"><div class="pagebuilder-poster-content"><div data-element="content"><h1><span style="color: #ffffff; background-color: #000000;">A new way of shopping</span></h1><p><span style="color: #ffffff; background-color: #000000;">Experience the best way of shopping today!</span></p></div><button type="button" class="pagebuilder-banner-button pagebuilder-button-primary" data-element="button" style="opacity: 1; visibility: visible;">Shop Bags</button></div></div></div></a></div>';
    expect(
        configAggregator(node.childNodes[0], {
            appearance: 'poster'
        })
    ).toEqual(
        expect.objectContaining({
            backgroundColor: 'blue',
            backgroundAttachment: 'scroll',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            border: 'none',
            borderColor: '',
            borderRadius: '0px',
            borderWidth: '1px',
            buttonText: 'Shop Bags',
            buttonType: 'primary',
            content:
                '<h1><span style="color: #ffffff; background-color: #000000;">A new way of shopping</span></h1><p><span style="color: #ffffff; background-color: #000000;">Experience the best way of shopping today!</span></p>',
            cssClasses: [],
            desktopImage: 'desktop-image.jpg',
            link: 'gear/bags.html',
            linkType: 'category',
            openInNewTab: true,
            marginBottom: '0px',
            marginLeft: '0px',
            marginRight: '0px',
            marginTop: '0px',
            minHeight: '300px',
            mobileImage: 'mobile-image.jpg',
            overlayColor: null,
            paddingBottom: '40px',
            paddingLeft: '40px',
            paddingRight: '40px',
            paddingTop: '40px',
            showButton: 'always',
            showOverlay: 'never',
            textAlign: ''
        })
    );
});

test('banner config aggregator retrieves values from fully configured collage-left banner content type', () => {
    const node = document.createElement('div');
    node.innerHTML =
        '<div data-content-type="banner" data-appearance="collage-left" data-show-button="always" data-show-overlay="always" data-element="main" style="margin: 0px;"><a href="gear/bags.html" target="_blank" data-link-type="category" data-element="link"><div class="pagebuilder-banner-wrapper" data-background-images="{\\&quot;desktop_image\\&quot;:\\&quot;desktop-image.jpg\\&quot;,\\&quot;mobile_image\\&quot;:\\&quot;mobile-image.jpg\\&quot;}" data-element="wrapper" style="background-position: center center; background-size: cover; background-repeat: no-repeat; background-attachment: scroll; border-style: none; border-width: 1px; border-radius: 0px; padding: 40px; min-height: 300px;"><div class="pagebuilder-overlay" data-overlay-color="rgba(255, 255, 255, 0.25)" data-element="overlay" style="background-color: transparent;"><div class="pagebuilder-collage-content"><div data-element="content"><div><h1><span style="color: #ffffff; background-color: #000000;">A new way of shopping</span></h1><p><span style="color: #ffffff; background-color: #000000;">Experience the best way of shopping today!</span></p></div></div><button type="button" class="pagebuilder-banner-button pagebuilder-button-primary" data-element="button" style="opacity: 1; visibility: visible;">Shop Bags</button></div></div></div></a></div>';
    expect(
        configAggregator(node.childNodes[0], {
            appearance: 'collage-left'
        })
    ).toEqual(
        expect.objectContaining({
            backgroundAttachment: 'scroll',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            border: 'none',
            borderColor: '',
            borderRadius: '0px',
            borderWidth: '1px',
            buttonText: 'Shop Bags',
            buttonType: 'primary',
            content:
                '<div><h1><span style="color: #ffffff; background-color: #000000;">A new way of shopping</span></h1><p><span style="color: #ffffff; background-color: #000000;">Experience the best way of shopping today!</span></p></div>',
            cssClasses: [],
            desktopImage: 'desktop-image.jpg',
            link: 'gear/bags.html',
            linkType: 'category',
            openInNewTab: true,
            marginBottom: '0px',
            marginLeft: '0px',
            marginRight: '0px',
            marginTop: '0px',
            minHeight: '300px',
            mobileImage: 'mobile-image.jpg',
            overlayColor: 'rgba(255, 255, 255, 0.25)',
            paddingBottom: '40px',
            paddingLeft: '40px',
            paddingRight: '40px',
            paddingTop: '40px',
            showButton: 'always',
            showOverlay: 'always',
            textAlign: ''
        })
    );
});

test('banner config aggregator retrieves values from fully configured collage-centered banner content type', () => {
    const node = document.createElement('div');
    node.innerHTML =
        '<div data-content-type="banner" data-appearance="collage-centered" data-show-button="always" data-show-overlay="never" data-element="main" style="margin: 0px;"><a href="gear/bags.html" target="_blank" data-link-type="category" data-element="link"><div class="pagebuilder-banner-wrapper" data-background-images="{\\&quot;desktop_image\\&quot;:\\&quot;desktop-image.jpg\\&quot;,\\&quot;mobile_image\\&quot;:\\&quot;mobile-image.jpg\\&quot;}" data-element="wrapper" style="background-position: center center; background-size: cover; background-repeat: no-repeat; background-attachment: scroll; border-style: none; border-width: 1px; border-radius: 0px; padding: 40px; min-height: 300px; text-align: right;"><div class="pagebuilder-overlay" data-overlay-color="rgba(255, 255, 255, 0.25)" data-element="overlay" style="background-color: transparent;"><div class="pagebuilder-collage-content"><div data-element="content"><div><h1><span style="color: #ffffff; background-color: #000000;">A new way of shopping</span></h1><p><span style="color: #ffffff; background-color: #000000;">Experience the best way of shopping today!</span></p></div></div><button type="button" class="pagebuilder-banner-button pagebuilder-button-secondary" data-element="button" style="opacity: 1; visibility: visible;">Shop Bags</button></div></div></div></a></div>';
    expect(
        configAggregator(node.childNodes[0], {
            appearance: 'collage-centered'
        })
    ).toEqual(
        expect.objectContaining({
            backgroundAttachment: 'scroll',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            border: 'none',
            borderColor: '',
            borderRadius: '0px',
            borderWidth: '1px',
            buttonText: 'Shop Bags',
            buttonType: 'secondary',
            content:
                '<div><h1><span style="color: #ffffff; background-color: #000000;">A new way of shopping</span></h1><p><span style="color: #ffffff; background-color: #000000;">Experience the best way of shopping today!</span></p></div>',
            cssClasses: [],
            desktopImage: 'desktop-image.jpg',
            link: 'gear/bags.html',
            linkType: 'category',
            openInNewTab: true,
            marginBottom: '0px',
            marginLeft: '0px',
            marginRight: '0px',
            marginTop: '0px',
            minHeight: '300px',
            mobileImage: 'mobile-image.jpg',
            overlayColor: null,
            paddingBottom: '40px',
            paddingLeft: '40px',
            paddingRight: '40px',
            paddingTop: '40px',
            showButton: 'always',
            showOverlay: 'never',
            textAlign: 'right'
        })
    );
});

test('banner config aggregator retrieves values from fully configured collage-right banner content type', () => {
    const node = document.createElement('div');
    node.innerHTML =
        '<div data-content-type="banner" data-appearance="collage-right" data-show-button="always" data-show-overlay="never" data-element="main" style="margin: 0px;"><a href="gear/bags.html" data-link-type="category" data-element="link"><div class="pagebuilder-banner-wrapper" data-background-images="{\\&quot;desktop_image\\&quot;:\\&quot;desktop-image.jpg\\&quot;,\\&quot;mobile_image\\&quot;:\\&quot;mobile-image.jpg\\&quot;}" data-element="wrapper" style="background-position: center center; background-size: cover; background-repeat: no-repeat; background-attachment: scroll; border-style: solid; border-color: red; border-width: 10px; border-radius: 15px; padding: 40px; min-height: 300px; text-align: center;"><div class="pagebuilder-overlay" data-overlay-color="rgba(255, 255, 255, 0.25)" data-element="overlay" style="background-color: transparent;"><div class="pagebuilder-collage-content"><div data-element="content"><div><h1><span style="color: #ffffff; background-color: #000000;">A new way of shopping</span></h1><p><span style="color: #ffffff; background-color: #000000;">Experience the best way of shopping today!</span></p></div></div><button type="button" class="pagebuilder-banner-button pagebuilder-button-link" data-element="button" style="opacity: 1; visibility: visible;">Link Button</button></div></div></div></a></div>';
    expect(
        configAggregator(node.childNodes[0], {
            appearance: 'collage-right'
        })
    ).toEqual(
        expect.objectContaining({
            backgroundAttachment: 'scroll',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            border: 'solid',
            borderColor: 'red',
            borderRadius: '15px',
            borderWidth: '10px',
            buttonText: 'Link Button',
            buttonType: 'link',
            content:
                '<div><h1><span style="color: #ffffff; background-color: #000000;">A new way of shopping</span></h1><p><span style="color: #ffffff; background-color: #000000;">Experience the best way of shopping today!</span></p></div>',
            cssClasses: [],
            desktopImage: 'desktop-image.jpg',
            link: 'gear/bags.html',
            linkType: 'category',
            openInNewTab: false,
            marginBottom: '0px',
            marginLeft: '0px',
            marginRight: '0px',
            marginTop: '0px',
            minHeight: '300px',
            mobileImage: 'mobile-image.jpg',
            overlayColor: null,
            paddingBottom: '40px',
            paddingLeft: '40px',
            paddingRight: '40px',
            paddingTop: '40px',
            showButton: 'always',
            showOverlay: 'never',
            textAlign: 'center'
        })
    );
});

test('banner config aggregator retrieve isHidden value', () => {
    const node = document.createElement('div');
    node.innerHTML =
        '<div data-content-type="banner" data-appearance="collage-right" data-show-button="always" data-show-overlay="never" data-element="main" style="display: none; margin: 0px;"><a href="gear/bags.html" data-link-type="category" data-element="link"><div class="pagebuilder-banner-wrapper" data-background-images="{\\&quot;desktop_image\\&quot;:\\&quot;desktop-image.jpg\\&quot;,\\&quot;mobile_image\\&quot;:\\&quot;mobile-image.jpg\\&quot;}" data-element="wrapper" style="background-position: center center; background-size: cover; background-repeat: no-repeat; background-attachment: scroll; border-style: solid; border-color: red; border-width: 10px; border-radius: 15px; padding: 40px; min-height: 300px; text-align: center;"><div class="pagebuilder-overlay" data-overlay-color="rgba(255, 255, 255, 0.25)" data-element="overlay" style="background-color: transparent;"><div class="pagebuilder-collage-content"><div data-element="content"><div><h1><span style="color: #ffffff; background-color: #000000;">A new way of shopping</span></h1><p><span style="color: #ffffff; background-color: #000000;">Experience the best way of shopping today!</span></p></div></div><button type="button" class="pagebuilder-banner-button pagebuilder-button-link" data-element="button" style="opacity: 1; visibility: visible;">Link Button</button></div></div></div></a></div>';
    expect(
        configAggregator(node.childNodes[0], {
            appearance: 'collage-right'
        })
    ).toEqual(
        expect.objectContaining({
            isHidden: true
        })
    );
});

test('banner config aggregator retrieve background video poster banner content type', () => {
    const node = document.createElement('div');
    node.innerHTML =
        '<div data-content-type="banner" data-appearance="poster" data-show-button="never" data-show-overlay="never" data-element="main" style="margin: 0px;"><div data-element="empty_link"><div class="pagebuilder-banner-wrapper" data-background-images="{}" data-background-type="video" data-video-src="mp4:https://example.com/example.mp4" data-video-loop="true" data-video-play-only-visible="true" data-video-lazy-load="true" data-video-fallback-src="https://example.com/image.jpg" data-element="wrapper" style="background-position: left top; background-size: cover; background-repeat: no-repeat; background-attachment: scroll; border-style: none; border-width: 1px; border-radius: 0px;"><div class="video-overlay" data-video-overlay-color="rgba(216, 56, 56, 0.75)" data-element="video_overlay" style="background-color: rgba(216, 56, 56, 0.75);"></div><div class="pagebuilder-overlay pagebuilder-poster-overlay" data-overlay-color="" data-element="overlay" style="border-radius: 0px; min-height: 500px; background-color: transparent; padding: 40px;"><div class="pagebuilder-poster-content"><div data-element="content">text</div></div></div></div></div></div>';
    const config = configAggregator(node.childNodes[0], {
        appearance: 'poster'
    });

    expect(config).toEqual(
        expect.objectContaining({
            backgroundType: 'video',
            videoFallbackSrc: 'https://example.com/image.jpg',
            videoLazyLoading: true,
            videoLoop: true,
            videoOverlayColor: 'rgba(216, 56, 56, 0.75)',
            videoPlayOnlyVisible: true,
            videoSrc: 'mp4:https://example.com/example.mp4'
        })
    );
});

test('banner config aggregator retrieve background video collage-left banner content type', () => {
    const node = document.createElement('div');
    node.innerHTML =
        '<div data-content-type="banner" data-appearance="collage-left" data-show-button="never" data-show-overlay="never" data-element="main" style="margin: 0px;"><div data-element="empty_link"><div class="pagebuilder-banner-wrapper" data-background-images="{}" data-background-type="video" data-video-src="mp4:https://example.com/example.mp4" data-video-loop="true" data-video-play-only-visible="true" data-video-lazy-load="true" data-video-fallback-src="https://example.com/image.jpg" data-element="wrapper" style="background-position: left top; background-size: cover; background-repeat: no-repeat; background-attachment: scroll; border-style: none; border-width: 1px; border-radius: 0px; padding: 40px; min-height: 500px;"><div class="video-overlay" data-video-overlay-color="rgba(216, 56, 56, 0.75)" data-element="video_overlay" style="background-color: rgba(216, 56, 56, 0.75);"></div><div class="pagebuilder-overlay" data-overlay-color="" data-element="overlay" style="background-color: transparent;"><div class="pagebuilder-collage-content"><div data-element="content">text</div></div></div></div></div></div>';
    const config = configAggregator(node.childNodes[0], {
        appearance: 'collage-left'
    });

    expect(config).toEqual(
        expect.objectContaining({
            backgroundType: 'video',
            videoFallbackSrc: 'https://example.com/image.jpg',
            videoLazyLoading: true,
            videoLoop: true,
            videoOverlayColor: 'rgba(216, 56, 56, 0.75)',
            videoPlayOnlyVisible: true,
            videoSrc: 'mp4:https://example.com/example.mp4'
        })
    );
});

test('banner config aggregator retrieve background video collage-centered banner content type', () => {
    const node = document.createElement('div');
    node.innerHTML =
        '<div data-content-type="banner" data-appearance="collage-centered" data-show-button="never" data-show-overlay="never" data-element="main" style="margin: 0px;"><div data-element="empty_link"><div class="pagebuilder-banner-wrapper" data-background-images="{}" data-background-type="video" data-video-src="mp4:https://example.com/example.mp4" data-video-loop="true" data-video-play-only-visible="true" data-video-lazy-load="true" data-video-fallback-src="https://example.com/image.jpg" data-element="wrapper" style="background-position: left top; background-size: cover; background-repeat: no-repeat; background-attachment: scroll; border-style: none; border-width: 1px; border-radius: 0px; padding: 40px; min-height: 500px;"><div class="video-overlay" data-video-overlay-color="rgba(216, 56, 56, 0.75)" data-element="video_overlay" style="background-color: rgba(216, 56, 56, 0.75);"></div><div class="pagebuilder-overlay" data-overlay-color="" data-element="overlay" style="background-color: transparent;"><div class="pagebuilder-collage-content"><div data-element="content">text</div></div></div></div></div></div>';
    const config = configAggregator(node.childNodes[0], {
        appearance: 'collage-centered'
    });

    expect(config).toEqual(
        expect.objectContaining({
            backgroundType: 'video',
            videoFallbackSrc: 'https://example.com/image.jpg',
            videoLazyLoading: true,
            videoLoop: true,
            videoOverlayColor: 'rgba(216, 56, 56, 0.75)',
            videoPlayOnlyVisible: true,
            videoSrc: 'mp4:https://example.com/example.mp4'
        })
    );
});

test('banner config aggregator retrieve background video collage-right banner content type', () => {
    const node = document.createElement('div');
    node.innerHTML =
        '<div data-content-type="banner" data-appearance="collage-right" data-show-button="never" data-show-overlay="never" data-element="main" style="margin: 0px;"><div data-element="empty_link"><div class="pagebuilder-banner-wrapper" data-background-images="{}" data-background-type="video" data-video-src="mp4:https://example.com/example.mp4" data-video-loop="true" data-video-play-only-visible="true" data-video-lazy-load="true" data-video-fallback-src="https://example.com/image.jpg" data-element="wrapper" style="background-position: left top; background-size: cover; background-repeat: no-repeat; background-attachment: scroll; border-style: none; border-width: 1px; border-radius: 0px; padding: 40px; min-height: 500px;"><div class="video-overlay" data-video-overlay-color="rgba(216, 56, 56, 0.75)" data-element="video_overlay" style="background-color: rgba(216, 56, 56, 0.75);"></div><div class="pagebuilder-overlay" data-overlay-color="" data-element="overlay" style="background-color: transparent;"><div class="pagebuilder-collage-content"><div data-element="content">text</div></div></div></div></div></div>';
    const config = configAggregator(node.childNodes[0], {
        appearance: 'collage-right'
    });

    expect(config).toEqual(
        expect.objectContaining({
            backgroundType: 'video',
            videoFallbackSrc: 'https://example.com/image.jpg',
            videoLazyLoading: true,
            videoLoop: true,
            videoOverlayColor: 'rgba(216, 56, 56, 0.75)',
            videoPlayOnlyVisible: true,
            videoSrc: 'mp4:https://example.com/example.mp4'
        })
    );
});
