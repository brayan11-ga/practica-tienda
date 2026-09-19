import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';
import '../styles/menu.css';

function Menu() {
    return (
        <Navbar className="menu">
            <Container>
                <Nav>
                    <Nav.Link as={Link} to="/clientes">
                    Clientes
                    </Nav.Link>
                    <Nav.Link as={Link} to="/productos">
                    Productos
                    </Nav.Link>
                    <Nav.Link as={Link} to="/ventas">
                    Ventas
                    </Nav.Link>
                </Nav>
            </Container>
        </Navbar>
    )

}

export default Menu;