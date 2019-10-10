import configAggregator from '../configAggregator';

test('tabs config aggregator retrieves default values from empty tabs content type', () => {
    const node = document.createElement('div');
    node.innerHTML = `<div className="tab-align-left" data-content-type="tabs" data-appearance="default" data-active-tab="" data-element="main" style="margin: 0px; padding: 0px;"><ul role="tablist" className="tabs-navigation" data-element="navigation" style="text-align: left;"><li role="tab" className="tab-header" data-element="headers" style="border-radius: 0px; border-width: 1px;"><a href="#VGUDQ3R" className="tab-title"><span className="tab-title">Tab 1</span></a></li></ul><div className="tabs-content" data-element="content" style="border-width: 1px; border-radius: 0px; min-height: 300px;"><div data-content-type="tab-item" data-appearance="default" data-tab-name="Tab 1" data-background-images="{}" data-element="main" id="VGUDQ3R" style="justify-content: flex-start; display: flex; flex-direction: column; background-position: left top; background-size: cover; background-repeat: no-repeat; background-attachment: scroll; border-width: 1px; border-radius: 0px; margin: 0px; padding: 40px;"></div></div></div>`;
    expect(
        configAggregator(node.childNodes[0], {
            appearance: 'default'
        })
    ).toEqual(
        expect.objectContaining({
            defaultIndex: 0,
            headers: ['Tab 1'],
            navigation: {
                style: {
                    paddingTop: '',
                    paddingRight: '',
                    paddingBottom: '',
                    paddingLeft: '',
                    marginTop: '',
                    marginRight: '',
                    marginBottom: '',
                    marginLeft: '',
                    border: '',
                    borderColor: '',
                    borderWidth: '',
                    borderRadius: '',
                    textAlign: 'left',
                    cssClasses: [],
                    isHidden: false
                },
                cssClasses: []
            },
            content: {
                style: {
                    minHeight: '300px',
                    paddingTop: '',
                    paddingRight: '',
                    paddingBottom: '',
                    paddingLeft: '',
                    marginTop: '',
                    marginRight: '',
                    marginBottom: '',
                    marginLeft: '',
                    border: '',
                    borderColor: '',
                    borderWidth: '1px',
                    borderRadius: '0px',
                    textAlign: '',
                    cssClasses: [],
                    isHidden: false
                }
            },
            minHeight: '300px',
            verticalAlignment: null,
            backgroundColor: '',
            desktopImage: null,
            mobileImage: null,
            backgroundSize: '',
            backgroundPosition: '',
            backgroundAttachment: '',
            backgroundRepeat: true,
            paddingTop: '0px',
            paddingRight: '0px',
            paddingBottom: '0px',
            paddingLeft: '0px',
            marginTop: '0px',
            marginRight: '0px',
            marginBottom: '0px',
            marginLeft: '0px',
            border: '',
            borderColor: '',
            borderWidth: '',
            borderRadius: '',
            textAlign: '',
            cssClasses: [],
            isHidden: false
        })
    );
});
