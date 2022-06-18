import styled from 'styled-components';

const Navbar = () => {
  
  const MyNavbar = styled.nav`
    background-color: #c4a65a;
    color: #24211b;
    display: flex;
    justify-content: center;
    font-weight: strong;
    padding: 1rem;
    width: 100vw;
  `;

  const Button = styled.a`
  border: 2px solid #24211b;
  border-radius: 5px;
  color: #24211b;
  margin-left: .5rem;
  padding: .5rem;
  text-decoration: none;
  `;

  return(
    <MyNavbar>
      <Button href="/">Login</Button>
      <Button href="/register">Register</Button>
    </MyNavbar>
  );
}

export default Navbar;
