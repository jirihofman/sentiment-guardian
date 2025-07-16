'use client';

import pjson from '../../package.json';
import { Container, Modal, Nav, Navbar } from 'react-bootstrap';
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
                    <Navbar.Brand href="/">
                        <span className="d-none d-sm-inline">{pjson.displayName}</span>
                        <span className="d-inline d-sm-none">{pjson.displayName.substring(0,13)}</span>
                    </Navbar.Brand>
                    <Navbar.Collapse id="navbarScroll" className="justify-content-end">
                        <Nav className='me-auto'>
                            <Link href="/sentiment-chart"><span className='d-none d-sm-inline me-2'>
                                Sentiment Chart
                            </span></Link>
                            <Link href="/faq"><span className='d-none d-sm-inline me-2'>FAQ</span></Link>
                            <span role='button' data-bs-toggle='modal' data-bs-target='#exampleModal' className='underline text-blue-600'>About</span>
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
                                        <th>Version:</th>
                                        <td>{[process.env.NEXT_PUBLIC_NODE_ENV || process.env.NODE_ENV, pjson.version].join('-')}</td>
                                    </tr>
                                    <tr>
                                        <th>GitHub:</th>
                                        <td>
                                            <Link href="https://github.com/jirihofman/sentiment-guardian">sentiment-guardian</Link>
                                        </td>
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
