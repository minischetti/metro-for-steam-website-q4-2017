import React from 'react'
import styled from 'styled-components'
import Header from './Header'



class Window extends React.Component {
    render() {
        const Window = styled.div`
            display: flex;
            margin: auto;
            width: 900px;
            height: 600px;
            background-color: black;
            box-shadow: 0 0 40px rgba(0,0,0,.25);
        `
        return (
            <Window>
                <Header></Header>
            </Window>
        )
    }
}

export default Window