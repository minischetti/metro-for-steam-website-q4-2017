import React from 'react'
import styled from 'styled-components'



class Header extends React.Component {
    render() {
        const Header = styled.div`
            height: ${props => props.primary ? '60px' : '40px'}
            border-bottom: 1px solid rgba(255,255,255,.1);
        `
        return(
            <div>
                <Header primary></Header>
                <Header secondary></Header>
            </div>
        )
    }
}

export default Header