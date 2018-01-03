import React from 'react'
import JSZip from 'jszip'
import JSZipUtils from 'jszip-utils'
import FileSaver from 'file-saver'

class App extends React.Component {
    constructor(props) {
        super(props);
        this.downloadZip = this.downloadZip.bind(this);
        this.fetchOption = this.fetchOption.bind(this);
        this.compileOptions = this.compileOptions.bind(this);
        this.updateRedValue = this.updateRedValue.bind(this);
        this.updateGreenValue = this.updateGreenValue.bind(this);
        this.updateBlueValue = this.updateBlueValue.bind(this);
        this.updateCustomizeState = this.updateCustomizeState.bind(this);
        this.fetchWebFonts = this.fetchWebFonts.bind(this);
        this.state = { customize: false, red: "0", green: "197", blue: "255" };
    }
    fetchWebFonts() {
        fetch('https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyDSW59mWbjuZsgiiZNds-q8CpZYjgEejfc')
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log(data);
        });
    }
    fetchOption() {
    }
    downloadZip() {
        const options = this.compileOptions();
        const fetchOption = this.fetchOption();
        JSZipUtils.getBinaryContent('metro-for-steam.zip', function (error, data) {
            if (error) {
                throw error;
            }
            var zip = new JSZip();
            zip.loadAsync(data)
                .then(function (zip) {
                    zip.file("custom.styles", options);
                    zip.folder("resource/layout/").remove("steamrootdialog_gamespage_details.layout");
                    zip.file("resource/layout/steamrootdialog_gamespage_details.layout", fetchOption);
                    // let file = new File("options/steamrootdialog_gamespage_details.layout");
                    // zip.file("Hello.txt", "Hello World\n");
                    // var folder = zip.folder("images");
                    // folder.file("custom.styles", 'custom.styles"{colors{Focus="102 36 226 255"basefont="Roboto"boldfont="Roboto Bold"lightfont="Roboto Light"}}');
                    // console.log(zip);
                })
                .then(function () {
                    zip.generateAsync({ type: "blob" })
                        .then(function (data) {
                            console.log(data);
                            FileSaver.saveAs(data, "metro-for-steam.zip");
                        });
                });
        });
    }

    compileOptions() {
        const red = this.state.red;
        const green = this.state.green;
        const blue = this.state.blue;
        return `"custom.styles"{colors{accent="${red} ${green} ${blue} 255"accentTransparent="${red} ${green} ${blue} 38.25"basefont="Roboto"boldfont="Roboto Bold"lightfont="Roboto Light"}}`;
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
        const fetchWebFonts = this.fetchWebFonts();
        return (
            <div className={`page ${this.state.customize ? "customize" : "home"}`}>
                <div className="main">
                    <div className="background-color" style={{ backgroundColor: `rgba(${this.state.red}, ${this.state.green}, ${this.state.blue}, .25)` }}></div>
                    <div className="button-container">
                        <div onClick={this.updateCustomizeState} className="big-button customize-button">Customize</div>
                        <div onClick={this.downloadZip} className="big-button download-button">Download</div>
                    </div>
                    <p className="hero-text">A new look for the platform you already know and love.</p>
                    <Steam red={this.state.red} green={this.state.green} blue={this.state.blue} downloadZip={this.downloadZip}/>
                </div>
                <div className="customization-panel">
                    <CustomizationPanel red={this.state.red} green={this.state.green} blue={this.state.blue} updateRedValue={this.updateRedValue} updateGreenValue={this.updateGreenValue} updateBlueValue={this.updateBlueValue}/>
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
        return (
            <div className="window" style={{ backgroundImage: `linear-gradient(rgba(${red}, ${green}, ${blue}, .15), black)` }}>
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
                <ColorPicker red={this.props.red} green={this.props.green} blue={this.props.blue} updateRedValue={this.props.updateRedValue} updateGreenValue={this.props.updateGreenValue} updateBlueValue={this.props.updateBlueValue}/>
                <DetailsViewSettings/>
            </div>
        )
    }
}

class DetailsViewSettings extends React.Component {
    render() {
        return(
            <div className="details-settings-container settings-container">
                <div className="setting-title">Details View</div>
                <div className="setting-content-container">
                    <input type="checkbox" id="sidebar-toggle"/>
                    <label htmlFor="sidebar-toggle">Sidebar Links</label>
                </div>
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