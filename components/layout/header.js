'use client';

import pjson from '../../package.json';
import { Container, Modal, Nav, NavDropdown, Navbar } from 'react-bootstrap';
import Link from 'next/link';

export default function Header() {

    return (
        <header>
            <noscript>
                <style>{'.nojs-show { opacity: 1; top: 0; }'}</style>
            </noscript>
            <Navbar bg="light" expand="sm">
                <Container fluid>
                    <Navbar.Toggle aria-controls="navbarScroll" />
                    <Navbar.Brand href="/">{pjson.displayName}</Navbar.Brand>
                    <Navbar.Collapse id="navbarScroll">
                        <Nav className='me-auto'>
                            <Link
                                passHref
                                href="https://github.com/jirihofman/nextjs-fullstack-app-template"
                                legacyBehavior><Nav.Link>GitHub</Nav.Link></Link>

                            <NavDropdown title={'Site'}>
                                <Link passHref href="/faq" legacyBehavior><NavDropdown.Item>FAQ</NavDropdown.Item></Link>
                                <NavDropdown.Divider />

                                <NavDropdown.Divider />
                                <NavDropdown.Item role='button' data-bs-toggle='modal' data-bs-target='#exampleModal'>About</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                            
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <div className="modal fade" id="exampleModal" tabIndex='-1' aria-labelledby="exampleModalLabel" aria-hidden="true">
                <Modal.Dialog className="modal-dialog">
                    <div className="modal-content">
                        <Modal.Header>
                            <h5 className="modal-title" id="exampleModalLabel">About <b>{pjson.displayName}</b></h5>
                        </Modal.Header>
                        <div className="modal-body">
                            <p>
                                {pjson.description}
                            </p>
                            <table>
                                <tbody>
                                    <tr>
                                        <th>Version</th>
                                        <td>{pjson.version}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </Modal.Dialog>
            </div>
        </header>
    );
}
