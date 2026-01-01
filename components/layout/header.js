'use client';

import pjson from '../../package.json';
import { Container, Modal, Nav, Navbar } from 'react-bootstrap';
import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
    const [showModal, setShowModal] = useState(false);

    return (
        <header className="mb-4">
            <noscript>
                <style>{'.nojs-show { opacity: 1; top: 0; }'}</style>
            </noscript>
            <Navbar expand="sm" className="py-3">
                <Container fluid>
                    <Navbar.Brand href="/" className="d-flex align-items-center">
                        <span className="fs-4 fw-bold d-none d-sm-inline">📰 {pjson.displayName}</span>
                        <span className="fs-5 fw-bold d-inline d-sm-none">📰 {pjson.displayName.substring(0,13)}</span>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbarScroll" />
                    <Navbar.Collapse id="navbarScroll">
                        <Nav className='ms-auto align-items-center gap-3'>
                            <Link href="/sentiment-chart" className="nav-link">
                                <span className='d-none d-sm-inline'>Sentiment Chart</span>
                                <span className='d-inline d-sm-none'>Chart</span>
                            </Link>
                            <Link href="/poi-monthly" className="nav-link">
                                <span className='d-none d-sm-inline'>Persons of Interest</span>
                                <span className='d-inline d-sm-none'>POI</span>
                            </Link>
                            <Link href="/faq" className="nav-link d-none d-sm-inline">FAQ</Link>
                            <button 
                                onClick={() => setShowModal(true)} 
                                className='nav-link btn btn-link text-decoration-none p-0 border-0'
                                style={{ background: 'none' }}
                            >
                                About
                            </button>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title className="fw-bold">About {pjson.displayName} 📰</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className="mb-3">{pjson.description}</p>
                    <div className="table-responsive">
                        <table className="table table-sm">
                            <tbody>
                                <tr>
                                    <th className="text-muted">Version:</th>
                                    <td>{[process.env.NEXT_PUBLIC_NODE_ENV || process.env.NODE_ENV, pjson.version].join('-')}</td>
                                </tr>
                                <tr>
                                    <th className="text-muted">GitHub:</th>
                                    <td>
                                        <Link href="https://github.com/jirihofman/sentiment-guardian" target="_blank" rel="noopener noreferrer">
                                            sentiment-guardian
                                        </Link>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </Modal.Body>
            </Modal>
        </header>
    );
}
