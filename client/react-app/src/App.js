import './App.css';
import styled from "styled-components";
import Employee from './components/Employee';
import {useState, useEffect} from "react"
function App() {
  const [employees, setEmployees] = useState([])
  const [sortType, setSortType] = useState(0)
  async function fetchEmployees(){
    const result = await((await fetch("/employees")).json())
    setEmployees(result)
  }
  function sortList(sortType){
    setEmployees(employees.sort((a,b) => {
      if(a.lastName?.toUpperCase()<b.lastName?.toUpperCase()){
        if(sortType) return -1
        return 1
      }
      if(a.lastName?.toUpperCase() > b.lastName?.toUpperCase()){
        if(sortType) return 1
        return -1
      }
      return 0
    }))
  }
  useEffect(()=>{
    sortList(sortType)
  },[sortType])
  useEffect(()=>{
    fetchEmployees()
  },[])
  return (
    <StyledDiv>
      <Button onClick={()=>setSortType(prevType => prevType===0?1:0)}>{sortType===0?"Sort descending":"Sort ascending"}</Button>
      <StyledSection>
          {employees.map(employee => <Employee key={employee.id} {...employee}/>)}
      </StyledSection>
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  text-align:left;
  padding-left:20px;
  margin:20px;
`

const StyledSection = styled.ul`
  list-style:none;
  display:flex;
  flex-direction:column;
  gap:20px;
`
const Button = styled.button`
margin-bottom:20px;
padding:10px;
border-radius:5px;
&:hover{
  cursor:pointer
}
`
export default App;
