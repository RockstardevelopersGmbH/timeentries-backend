import styled from "styled-components";
export default function Employee({firstName, lastName, email}){
    return <StyledItem>
        <dt>Firstname</dt><dd><b>{firstName}</b></dd>
        <dt>Lastname</dt><dd><b>{lastName}</b></dd>
        <dt>Email</dt><dd><b>{email}</b></dd>
    </StyledItem>
}

const StyledItem = styled.li`
    list-style:none;
    display:grid;
    grid-template-columns:1fr 2fr;
    text-align:left;
    gap:5px;
`