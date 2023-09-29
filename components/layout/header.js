'use client';

import pjson from '../../package.json';
import { Container, Modal, Nav, Navbar } from 'react-bootstrap';
import Link from 'next/link';
import Buttons from '../buttons';
import { UserButton, useSession, useUser } from '@clerk/nextjs';

export default function Header() {

    const { isLoaded, isSignedIn } = useSession();
    const { user } = useUser();
    const isAdmin = user?.emailAddresses?.find(email => email.emailAddress === pjson.author.email);

    const handleSignInClick = (evt) => {
        evt.preventDefault();
        // Redirect to sign-in page.
        window.location.href = '/sign-in';
    };

    return (
        <header>
            <noscript>
                <style>{'.nojs-show { opacity: 1; top: 0; }'}</style>
            </noscript>
            <Navbar bg="light" expand="sm">
                <Container fluid>
                    <Navbar.Toggle aria-controls="navbarScroll" />
                    <Navbar.Brand href="/">
                        <span className="d-none d-sm-inline">{pjson.displayName}</span>
                        <span className="d-inline d-sm-none">{pjson.displayName.substring(0,13)}</span>                        
                    </Navbar.Brand>
                    <Navbar.Collapse id="navbarScroll" className="justify-content-end">
                        <Nav className='me-auto'>
                            <Link
                                passHref
                                href="https://github.com/jirihofman/nextjs-fullstack-app-template"
                                legacyBehavior><Nav.Link>GitHub</Nav.Link></Link>

                            <Link passHref href="/faq" legacyBehavior><Nav.Link>FAQ</Nav.Link></Link>
                            <Nav.Link role='button' data-bs-toggle='modal' data-bs-target='#exampleModal'>About</Nav.Link>
                            <Nav.Item>{isAdmin && <Buttons />}</Nav.Item>
                            <Nav>
                                {!isLoaded && <div className="spinner-border spinner-border-sm text-primary" role="status">
                                    <span className="sr-only" />
                                </div>}
                                {!isSignedIn && isLoaded && <button className='btn-sm btn btn-outline-primary' onClick={handleSignInClick}>Sign in</button>}
                                <UserButton afterSignOutUrl="/" />
                            </Nav>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <div className="modal fade" id="exampleModal" tabIndex='-1' aria-labelledby="exampleModalLabel" aria-hidden="true">
                <Modal.Dialog className="modal-dialog">
                    <div className="modal-content">
                        <Modal.Header>
                            <h5 className="modal-title" id="exampleModalLabel">About <b>{pjson.displayName}</b> 📰</h5>
                        </Modal.Header>
                        <div className="modal-body">
                            <p>{pjson.description}</p>
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
