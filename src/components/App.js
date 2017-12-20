import React from 'react'
import styled from 'styled-components'
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
        this.state = { red: "0", green: "197", blue: "255"};
    }
    downloadZip() {
        const options = this.compileOptions();
        JSZipUtils.getBinaryContent('metro-for-steam.zip', function (error, data) {
            if (error) {
                throw error;
            }
            console.log(data);
            var zip = new JSZip();
            zip.loadAsync(data)
                .then(function (zip) {
                    zip.file("custom.styles", options);
                    // zip.file("Hello.txt", "Hello World\n");
                    // var folder = zip.folder("images");
                    // folder.file("custom.styles", 'custom.styles"{colors{Focus="102 36 226 255"basefont="Roboto"boldfont="Roboto Bold"lightfont="Roboto Light"}}');
                    console.log(zip);
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
        return `custom.styles"{colors{accent="${red} ${green} ${blue} 255"accentTransparent="${red} ${green} ${blue} 38.25"basefont="Roboto"boldfont="Roboto Bold"lightfont="Roboto Light"}}`;
    }

    updateRedValue(event) {
        this.setState({ red: event.target.value});
    }

    updateGreenValue(event) {
        this.setState({ green: event.target.value});
    }

    updateBlueValue(event) {
        this.setState({ blue: event.target.value});
    }

    render() {
        return (
            <div>
                <ColorPicker red={this.state.red} green={this.state.green} blue={this.state.blue} updateRedValue={this.updateRedValue} updateGreenValue={this.updateGreenValue} updateBlueValue={this.updateBlueValue}></ColorPicker>
                <Steam red={this.state.red} green={this.state.green} blue={this.state.blue} downloadZip={this.downloadZip}></Steam>
            </div>
        )
    }


}

class Steam extends React.Component {
    render() {
        const red = this.props.red;
        const green = this.props.green;
        const blue = this.props.blue;
        const Window = styled.div`
            display: flex;
            flex-direction: column;
            margin: auto;
            width: 900px;
            height: 600px;
            background: linear-gradient(rgba(${red}, ${green}, ${blue}, .15), black);
            background-color: black;
            box-shadow: 0 0 40px rgba(0,0,0,.25);
        `
        return (
            <Window>
                <div onClick={this.props.downloadZip}>Download Zip</div>
                <Header primary>
                    <NavLink>Store</NavLink>
                    <NavLink active>Library</NavLink>
                    <NavLink>Communities</NavLink>
                    <FrameButton close></FrameButton>
                    <FrameButton></FrameButton>
                    <FrameButton></FrameButton>
                    <Button></Button>
                    <Button></Button>
                    <Button></Button>
                </Header>
                <Header></Header>
            </Window>
        )
    }
}

class ColorPicker extends React.Component {
    render() {
        const red = this.props.red;
        const green = this.props.green;
        const blue = this.props.blue;
        return (
            <div className="slidecontainer">
                <input type="range" min="1" max="255" defaultValue={red} className="slider" onInput={this.props.updateRedValue} id="red"/>
                <input type="range" min="1" max="255" defaultValue={green} className="slider" onChange={this.props.updateGreenValue} id="green"/>
                <input type="range" min="1" max="255" defaultValue={blue} className="slider" onChange={this.props.updateBlueValue} id="blue"/>
            </div>
        )
    }
}

class Button extends React.Component {
    render() {
        const Button = styled.div`
            width: 30px;
            height: 30px;
            margin-right: 10px;
            border-radius: 50%;
            border: 1px solid rgba(255,255,255,.1);
        `
        return (
            <Button></Button>
        )
    }
}

class NavLink extends React.Component {
    render() {
        const Link = styled.span`
            color: ${props => this.props.active ? 'white' : 'rgba(255,255,255,.25)'};
            font-weight: 300;
            text-transform: uppercase;
            margin-right: 10px;
        `
        return (
            <Link>{this.props.children}</Link>
        )
    }
}

class Header extends React.Component {
    render() {
        const Header = styled.div`
            width: 100%;
            height: ${props => this.props.primary ? '60px' : '40px'};
            border-bottom: 1px solid rgba(255,255,255,.1);
        `
        return (
            <Header>{this.props.children}</Header>
        )
    }
}

class FrameButton extends React.Component {
    render() {
        const FrameButton = styled.div`
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background-color: ${props => this.props.close ? 'red' : 'rgba(255,255,255,.1)'};
        `
        return (
            <FrameButton></FrameButton>
        )
    }
}

export default App