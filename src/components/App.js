import React from 'react'
import styled from 'styled-components'



class App extends React.Component {
    render() {
        const Window = styled.div`
            display: flex;
            flex-direction: column;
            margin: auto;
            width: 900px;
            height: 600px;
            background-color: black;
            box-shadow: 0 0 40px rgba(0,0,0,.25);
        `
        return (
            <Window>
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

class Button extends React.Component {
    render() {
        const Button = styled.div`
            width: 30px;
            height: 30px;
            margin-right: 10px;
            border-radius: 50%;
            border: 1px solid rgba(255,255,255,.1);
        `
        return(
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
        return(
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
        return(
            <FrameButton></FrameButton>
        )
    }
}

export default App