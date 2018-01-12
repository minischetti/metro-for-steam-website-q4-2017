import React from 'react'
import JSZip from 'jszip'
import JSZipUtils from 'jszip-utils'
import FileSaver from 'file-saver'

class App extends React.Component {
    constructor(props) {
        super(props);
        this.downloadZip = this.downloadZip.bind(this);
        this.compileOptions = this.compileOptions.bind(this);
        this.updateRedValue = this.updateRedValue.bind(this);
        this.updateGreenValue = this.updateGreenValue.bind(this);
        this.updateBlueValue = this.updateBlueValue.bind(this);
        this.fetchWebFonts = this.fetchWebFonts.bind(this);
        this.constructCompatibleFontList = this.constructCompatibleFontList.bind(this);
        this.constructFontImport = this.constructFontImport.bind(this);
        this.updateSelectedFont = this.updateSelectedFont.bind(this);
        this.retrieveSelectedFont = this.retrieveSelectedFont.bind(this);
        this.updateCurrentPage = this.updateCurrentPage.bind(this);
        this.state = { compatibleFonts: [], selectedFont: "Roboto", currentPage: "home", pages: ["home", "customize", "help"], red: "0", green: "197", blue: "255" };
    }

    componentDidMount() {
        this.fetchWebFonts();
    }

    constructFontImport(name) {
        const styleObject = document.createElement("style");
        const steamWindow = document.querySelector(".window");
        styleObject.innerHTML = `@import url('https://fonts.googleapis.com/css?family=${name.replace(' ', '+')}:300,400,700');`;
        document.body.appendChild(styleObject);
    }

    constructCompatibleFontList(compatibleFonts) {
        this.setState({ compatibleFonts: compatibleFonts });
        const newFonts = this.state.compatibleFonts;
        newFonts.forEach((font) => {
            this.constructFontImport(font.name);
        });
    }

    retrieveSelectedFont(file) {
        const selectedFont = this.state.selectedFont;
        const fontFiles = selectedFont.files[file];
        return fetch(fontFiles)
            .then((response) => {
                return response.blob();
            });
    }

    updateCurrentPage(page) {
        this.setState({ currentPage: page });
    }

    fetchWebFonts() {
        fetch('https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyDSW59mWbjuZsgiiZNds-q8CpZYjgEejfc')
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                const fontList = data.items;
                const lightWeight = "300";
                const regularWeight = "regular";
                const boldWeight = "700";
                const compatibleFonts = new Array;
                fontList.forEach(font => {
                    const fontVariants = font.variants;
                    const fontName = font.family;
                    if (fontName === "Roboto") {
                        const fontObject = new Object();
                        fontObject.name = font.family;
                        fontObject.files = new Array(font.files[lightWeight], font.files[regularWeight], font.files[boldWeight]);
                        this.setDefaultFont(fontObject);
                    }
                    if (fontVariants.includes(lightWeight) && fontVariants.includes(boldWeight) && fontVariants.includes(regularWeight)) {
                        const fontObject = new Object();
                        fontObject.name = font.family;
                        fontObject.files = new Array(font.files[lightWeight], font.files[regularWeight], font.files[boldWeight]);
                        compatibleFonts.push(fontObject);
                    }
                });
                this.constructCompatibleFontList(compatibleFonts);
            });
    }

    downloadZip() {
        const options = this.compileOptions();
        const selectedFontName = this.state.selectedFont.name.replace(" ", "");
        JSZipUtils.getBinaryContent('metro-for-steam.zip', (error, data) => {
            if (error) {
                throw error;
            }
            var zip = new JSZip();
            zip.loadAsync(data)
                .then((zip) => {
                    zip.file("custom.styles", options);

                    // [TODO] If a setting requires that this file is modified, remove the old one and replace it with the new one
                    // zip.folder("resource/layout/").remove("steamrootdialog_gamespage_details.layout");
                    // zip.file("resource/layout/steamrootdialog_gamespage_details.layout", fetchOption);

                    // Package Selected Font's Weights as Separate Files
                    zip.folder("font").file(`${selectedFontName}Light.ttf`, this.retrieveSelectedFont(0));
                    zip.folder("font").file(`${selectedFontName}Regular.ttf`, this.retrieveSelectedFont(1));
                    zip.folder("font").file(`${selectedFontName}Bold.ttf`, this.retrieveSelectedFont(2));
                })
                .then(() => {
                    zip.generateAsync({ type: "blob" })
                        .then(function (data) {
                            FileSaver.saveAs(data, "metro-for-steam.zip");
                        });
                });
        });
    }

    compileOptions() {
        const red = this.state.red;
        const green = this.state.green;
        const blue = this.state.blue;
        const selectedFont = this.state.selectedFont;
        return `"custom.styles"{colors{accent="${red} ${green} ${blue} 255"accentTransparent="${red} ${green} ${blue} 38.25"basefont="${selectedFont.name}"boldfont="${selectedFont.name} Bold"lightfont="${selectedFont.name} Light"}}`;
    }

    setDefaultFont(font) {
        this.setState({ selectedFont: font });
    }

    updateSelectedFont(fontIndex) {
        const selectedFont = this.state.compatibleFonts[fontIndex];
        this.setState({ selectedFont: selectedFont });
    }

    updateRedValue(event) {
        this.setState({ red: event.target.value });
    }

    updateGreenValue(event) {
        this.setState({ green: event.target.value });
    }

    updateBlueValue(event) {
        this.setState({ blue: event.target.value });
    }

    render() {
        let currentPage = this.state.currentPage;
        const red = this.state.red;
        const green = this.state.green;
        const blue = this.state.blue;
        const rgb = `rgb(${red}, ${green}, ${blue})`
        return (
            <div className={`page ${currentPage}`}>
                <div className="background-color" style={{ backgroundImage: `linear-gradient(${rgb}, transparent)`}}></div>
                <div className="top-header">
                    {/* <div onClick={() => this.updateCurrentPage("home")} className="top-button home-button">Home</div> */}
                    {/* <div className="top-button-container">
                        <div onClick={() => this.updateCurrentPage("help")} className="top-button top-nav-button help-button"><div className="nav-indicator"></div>Help</div>
                        <div onClick={() => this.updateCurrentPage("customize")} className="top-button top-nav-button customize-button"><div className="nav-indicator"></div>Customize</div>
                    </div> */}
                    <div onClick={this.downloadZip} className="top-button download-button">Download</div>
                </div>
                <HelpPage/>
                <div className="main">
                    <h1 className="hero-text">A new look for the platform you already know and love.</h1>
                    <Steam red={this.state.red} green={this.state.green} blue={this.state.blue} downloadZip={this.downloadZip} selectedFont={this.state.selectedFont} />
                </div>
                <div className="customization-panel">
                    <CustomizationPanel red={this.state.red} green={this.state.green} blue={this.state.blue} updateRedValue={this.updateRedValue} updateGreenValue={this.updateGreenValue} updateBlueValue={this.updateBlueValue} updateSelectedFont={this.updateSelectedFont} selectedFont={this.state.selectedFont} fonts={this.state.compatibleFonts} />
                </div>
                <SocialLinks/>
                <Menu currentPage={this.state.currentPage} pages={this.state.pages} updateCurrentPage={this.updateCurrentPage}/>
            </div>
        )
    }


}

class Menu extends React.Component {
    toggleMenu() {
        const menu = document.querySelector(".hamburger");
        menu.classList.toggle("active");
    }
    selectMenuItem(page) {
        this.toggleMenu();
        this.props.updateCurrentPage(page);
    }
    render() {
        const pages = this.props.pages;
        const pageList = pages.map((pageName, index) =>
            <div onClick={() => this.selectMenuItem(pageName)} className={`menu-item {pageName}-menu-item`}>{pageName}</div>
        );
        return (
            <div className="hamburger" onClick={() => this.toggleMenu()}>
                <div className="hamburger-line-container">
                    <div className="vertical">
                        <span></span>
                        <span></span>
                    </div>
                    <div className="middle">
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>
            // <div className="menu">
            //     <div onClick={() => this.toggleMenu()} className="current-page">{this.props.currentPage}</div>
            //     <div className="menu-item-container">
            //         {pageList}
            //     </div>
            // </div>
        )
    }
}

class Steam extends React.Component {
    render() {
        const red = this.props.red;
        const green = this.props.green;
        const blue = this.props.blue;
        const selectedFont = this.props.selectedFont;
        const windowStyle = {
            backgroundImage: `linear-gradient(rgba(${red}, ${green}, ${blue}, .15), black)`,
            fontFamily: selectedFont.name
        };
        return (
            <div className="window" style={windowStyle}>
                <div className="header">
                    <div className="nav-button-container">
                        <div className="nav-button">
                            <img src="/assets/back.svg" />
                        </div>
                        <div className="nav-button forward">
                            <img src="/assets/back.svg" />
                        </div>
                    </div>
                    <span className="nav-link active" style={{ boxShadow: `inset 0 1px 0 rgb(${red}, ${green}, ${blue})`, color: `rgb(${red}, ${green}, ${blue})` }}>Store</span>
                    <span className="nav-link">Library</span>
                    <span className="nav-link">Community</span>
                    <div className="action-button-container">
                        <div className="button"></div>
                        <div className="button"></div>
                        <div className="button"></div>
                    </div>
                    <div className="frame-button-container">
                        <div className="frame-button">
                            <img src="/assets/min.svg" />
                        </div>
                        <div className="frame-button">
                            <img src="/assets/max.svg" />
                        </div>
                        <div className="frame-button">
                            <img src="/assets/close.svg" />
                        </div>
                    </div>
                </div>
                <div className="header secondary"></div>
            </div>
        )
    }
}

class CustomizationPanel extends React.Component {
    render() {
        return (
            <div>
                <ColorPicker red={this.props.red} green={this.props.green} blue={this.props.blue} updateRedValue={this.props.updateRedValue} updateGreenValue={this.props.updateGreenValue} updateBlueValue={this.props.updateBlueValue} />
                <FontList fonts={this.props.fonts} updateSelectedFont={this.props.updateSelectedFont} selectedFont={this.props.selectedFont} />
                <DetailsViewSettings />
            </div>
        )
    }
}

class ColorPicker extends React.Component {
    constructor(props) {
        super(props);
        this.toHexString = this.toHexString.bind(this);
        this.toHex = this.toHex.bind(this);
    }
    toHex(number) {
        let hex = parseInt(number).toString(16);
        while (hex.length < 2) { hex = "0" + hex; }
        return hex;
    }
    toHexString() {
        let r = this.toHex(this.props.red);
        let g = this.toHex(this.props.green);
        let b = this.toHex(this.props.blue);
        return `#${r}${g}${b}`;
    }
    render() {
        const red = this.props.red;
        const green = this.props.green;
        const blue = this.props.blue;
        const hex = this.toHexString();
        const rgb = `rgb(${red}, ${green}, ${blue})`
        return (
            <div className="color-picker-container settings-container">
                <div className="setting-header">
                    <div className="setting-title">Color</div>
                    <div className="setting-current">{rgb}</div>
                </div>
                <div className="setting-content-container">
                    <input type="range" min="1" max="255" defaultValue={red} className="slider" onInput={this.props.updateRedValue} id="red" />
                    <input type="range" min="1" max="255" defaultValue={green} className="slider" onChange={this.props.updateGreenValue} id="green" />
                    <input type="range" min="1" max="255" defaultValue={blue} className="slider" onChange={this.props.updateBlueValue} id="blue" />
                </div>
            </div>
        )
    }
}

class FontList extends React.Component {
    constructor(props) {
        super(props);
        this.handleFontChange = this.handleFontChange.bind(this);
        this.autoScrollElement = this.autoScrollElement.bind(this);
        this.startScroll = this.startScroll.bind(this);
        this.state = { intervalId: "" }
    }

    componentDidMount() {
        const fontList = document.getElementById("font-list");
        fontList.addEventListener("click", (event) => {
            this.handleFontChange(event.target.dataset.value);
        });
    }

    autoScrollElement() {
        const elements = document.querySelectorAll(".auto-scroll-element");
        elements.forEach((element) => {
            const elementWidth = element.offsetWidth;
            const scrollEnd = element.scrollWidth;
            const distanceToEnd = scrollEnd - elementWidth;
            let distance = this.state.intervalId;
            if (distance < distanceToEnd) {
                element.scrollLeft = distance;
                this.setState({ intervalId: distance + .25 });
            } else {
                this.setState({ intervalId: 0 });
                clearInterval(this.state.intervalId);
            }
        });
    }

    startScroll() {
        let intervalId = setInterval(this.autoScrollElement, 60);
        this.setState({ intervalId: intervalId })
    }

    handleFontChange(font) {
        this.props.updateSelectedFont(font);
        // this.startScroll();
    }

    render() {
        const selectedFont = this.props.selectedFont.name || "Roboto";
        const fonts = this.props.fonts;
        const fontList = fonts.map((font, index) =>
            <span key={font.name} className="font-list-item" data-value={index} style={{ fontFamily: font.name }}>{font.name}</span>
        );
        return (
            <div className="font-settings-container settings-container">
                <div className="setting-header">
                    <div className="setting-title">Font</div>
                    <div className="setting-current auto-scroll-element">{selectedFont}</div>
                </div>
                <form>
                    <div id="font-list" className="font-list">
                        {fontList}
                    </div>
                </form>
            </div>
        )
    }
}

class DetailsViewSettings extends React.Component {
    render() {
        return (
            <div className="details-settings-container settings-container">
                <div className="setting-header">
                    <div className="setting-title">Details View</div>
                </div>
                <div className="setting-content-container">
                    <div className="checkbox-container">
                        <div className="checkbox-check"></div>
                        <div className="checkbox-label">Sidebar Links</div>
                    </div>
                </div>
            </div>
        )
    }
}

class SocialLinks extends React.Component {
    toggleExpansion(event) {
        event.target.parentNode.classList.toggle("active");
    }
    render() {
        return (
            <div className="social-container">
                <div className="link-container">
                    <a className="external-link" href="https://twitter.com/thisisdomdraper"><img src="./assets/twitter.svg" /></a>
                    <a className="external-link" href="https://www.youtube.com/user/domminischetti?sub_confirmation=1"><img src="./assets/youtube.svg" /></a>
                    <a className="external-link" href="http://steamcommunity.com/groups/metroforsteam"><img src="./assets/steam.svg" /></a>
                    <span className="link-toggle" onClick={(event) => this.toggleExpansion(event)}>Connect</span>
                </div>
                <div className="link-container">
                    <a className="external-link" href="https://domdraper.bandcamp.com/"><img src="./assets/bandcamp.svg" /></a>
                    <a className="external-link" href="http://www.patreon.com/dommini"><img src="./assets/patreon.svg" /></a>
                    <a className="external-link" href="https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=BDL2J3MEETZ3J&lc=US&item_name=Metro%20for%20Steam&item_number=metroforsteam&currency_code=USD&bn=PP%2dDonationsBF%3abtn_donate_LG%2egif%3aNonHosted"><img src="./assets/paypal.svg" /></a>
                    <span className="link-toggle" onClick={(event) => this.toggleExpansion(event)}>Support</span>
                </div>
            </div>
        )
    }
}

class HelpPage extends React.Component {
    render() {
        return (
            <div className="help-page">
                <div className="help-content">
                    <div className="step step-1">
                        <div className="step-title"><span>01</span>Download</div>
                        <p>Download Metro... or personalize it first! The download will include your custom color, font and any other settings you may have changed.</p>
                    </div>
                    <div className="step step-2">
                        <div className="step-title"><span>02</span>Install</div>
                        <p>Open your Steam directory. From there, open the skins folder and copy Metro to it.</p>
                    </div>
                    <div className="step step-3">
                        <div className="step-title"><span>03</span>Enable</div>
                        <p>In Steam, open the settings window and go to the Interface page. From there, choose Metro in the skin selection dropdown. Restart Steam and enjoy!</p>
                    </div>
                </div>
            </div>
        )
    }
}

class SupportPage extends React.Component {
    render() {
        return (
            <div className="help-page">
                <div className="help-content">
                    <div className="step step-1">
                        <div className="step-title"><span>01</span>Following</div>
                        <p>Be sure to follow me on <a className="external-link" href="https://www.youtube.com/user/domminischetti?sub_confirmation=1"><img src="./assets/youtube.svg" /></a> and join the official Steam Community group.</p>
                    </div>
                    <div className="step step-2">
                        <div className="step-title"><span>02</span>Listening</div>
                        <p>Open your Steam directory. From there, open the skins folder and copy Metro to it.</p>
                    </div>
                    <div className="step step-3">
                        <div className="step-title"><span>03</span>Supporting</div>
                        <p>In Steam, open the settings window and go to the Interface page. From there, choose Metro in the skin selection dropdown. Restart Steam and enjoy!</p>
                    </div>
                </div>
            </div>
        )
    }
}

export default App