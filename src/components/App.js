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
        this.updateCustomizeState = this.updateCustomizeState.bind(this);
        this.fetchWebFonts = this.fetchWebFonts.bind(this);
        this.constructCompatibleFontList = this.constructCompatibleFontList.bind(this);
        this.constructFontImport = this.constructFontImport.bind(this);
        this.updateSelectedFont = this.updateSelectedFont.bind(this);
        this.retrieveSelectedFont = this.retrieveSelectedFont.bind(this);
        this.state = { compatibleFonts: [], selectedFont: "Roboto", customize: false, red: "0", green: "197", blue: "255" };
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

    fetchWebFonts() {
        fetch('https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyDSW59mWbjuZsgiiZNds-q8CpZYjgEejfc')
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                const fontList = data.items;
                // console.log(data.items[8]);
                const lightWeight = "300";
                const regularWeight = "regular";
                const boldWeight = "700";
                const compatibleFonts = new Array;
                fontList.forEach(font => {
                    const fontVariants = font.variants;
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
        const selectedFontName = this.state.selectedFont.name.replace(" ","");
        JSZipUtils.getBinaryContent('metro-for-steam.zip', (error, data) => {
            if (error) {
                throw error;
            }
            var zip = new JSZip();
            zip.loadAsync(data)
                .then((zip) => {
                    zip.file("custom.styles", options);

                    // TODO If a setting requires that this file is modified, remove the old one and replace it with the new one
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

    updateCustomizeState() {
        this.setState({ customize: !this.state.customize });
    }

    render() {
        return (
            <div className={`page ${this.state.customize ? "customize" : "home"}`}>
                <div className="main">
                    <div className="background-color" style={{ backgroundColor: `rgba(${this.state.red}, ${this.state.green}, ${this.state.blue}, .25)` }}></div>
                    <div className="button-container">
                        <div onClick={this.updateCustomizeState} className="big-button customize-button">Customize</div>
                        <div onClick={this.downloadZip} className="big-button download-button">Download</div>
                    </div>
                    <p className="hero-text">A new look for the platform you already know and love.</p>
                    <Steam red={this.state.red} green={this.state.green} blue={this.state.blue} downloadZip={this.downloadZip} selectedFont={this.state.selectedFont} />
                </div>
                <div className="customization-panel">
                    <CustomizationPanel red={this.state.red} green={this.state.green} blue={this.state.blue} updateRedValue={this.updateRedValue} updateGreenValue={this.updateGreenValue} updateBlueValue={this.updateBlueValue} updateSelectedFont={this.updateSelectedFont} fonts={this.state.compatibleFonts} />
                </div>
            </div>
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
                <DetailsViewSettings />
                <FontList fonts={this.props.fonts} updateSelectedFont={this.props.updateSelectedFont} />
            </div>
        )
    }
}

class DetailsViewSettings extends React.Component {
    render() {
        return (
            <div className="details-settings-container settings-container">
                <div className="setting-title">Details View</div>
                <div className="setting-content-container">
                    <input type="checkbox" id="sidebar-toggle" />
                    <label htmlFor="sidebar-toggle">Sidebar Links</label>
                </div>
            </div>
        )
    }
}

class FontList extends React.Component {
    constructor(props) {
        super(props);
        this.handleFontChange = this.handleFontChange.bind(this);
    }
    componentDidMount() {
        const fontList = document.getElementById("font-list");
        fontList.addEventListener("change", (event) => {
            this.handleFontChange(event.target.value);
        });
    }
    handleFontChange(font) {
        this.props.updateSelectedFont(font);
    }
    render() {
        const fonts = this.props.fonts;
        const fontList = fonts.map((font, index) =>
            <option key={font.name} value={index} style={{ fontFamily: font.name }}>{font.name}</option>
        );
        return (
            <div className="font-settings-container settings-container">
                <div className="setting-title">Font</div>
                <form className="setting-content-container">
                    <select name="font" id="font-list" size="10" className="font-list">
                        {fontList}
                    </select>
                </form>
            </div>
        )
    }
}

class ColorPicker extends React.Component {
    render() {
        const red = this.props.red;
        const green = this.props.green;
        const blue = this.props.blue;
        return (
            <div className="color-picker-container settings-container">
                <div className="setting-title">Color</div>
                <div className="setting-content-container">
                    <input type="range" min="1" max="255" defaultValue={red} className="slider" onInput={this.props.updateRedValue} id="red" />
                    <input type="range" min="1" max="255" defaultValue={green} className="slider" onChange={this.props.updateGreenValue} id="green" />
                    <input type="range" min="1" max="255" defaultValue={blue} className="slider" onChange={this.props.updateBlueValue} id="blue" />
                </div>
            </div>
        )
    }
}

export default App