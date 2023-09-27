'use client';

import { Button, Container, Badge } from 'react-bootstrap';
import { BookHalf } from 'react-bootstrap-icons';
import Link from 'next/link';
import Image from 'next/image';
import packageLock from '../../package-lock.json';

const Feature = () => {
    const w = '40';
    const features = [
        {
            buttons: [
                <Link key={1} passHref href="https://nextjs.org/" legacyBehavior><Button className='m-1' variant="primary"><BookHalf className='bi' /> Nextjs {VersionBadge('next')}</Button></Link>,
            ],
            desc: 'Nextjs framework.',
            img: <Image
                alt=''
                height={w}
                width={w}
                src='https://camo.githubusercontent.com/f21f1fa29dfe5e1d0772b0efe2f43eca2f6dc14f2fede8d9cbef4a3a8210c91d/68747470733a2f2f6173736574732e76657263656c2e636f6d2f696d6167652f75706c6f61642f76313636323133303535392f6e6578746a732f49636f6e5f6c696768745f6261636b67726f756e642e706e67'
            />,
            title: 'Nextjs',
        }, {
            buttons: [
                <Link key={1} passHref href="https://getbootstrap.com/" legacyBehavior><Button className='m-1' variant="primary"><BookHalf className='bi' /> Bootstrap {VersionBadge('bootstrap')}</Button></Link>,
                <Link key={2} passHref href="https://react-bootstrap.github.io/" legacyBehavior><Button className='m-1' variant="primary"><BookHalf className='bi' /> React Bootstrap {VersionBadge('react-bootstrap')}</Button></Link>,
            ],
            desc: 'Bootstrap 5 + React Bootstrap.',
            img: <Image
                alt=''
                height={w}
                width={w}
                src='https://raw.githubusercontent.com/react-bootstrap/react-bootstrap/7c66098610ea7aea89edfe38988990ba8abcd31d/www/static/logo.svg'
            />,
            title: 'React Bootstrap',
        },
    ];
    return (
        <Container className='px-4 py-5'>
            <h2 className="pb-2 border-bottom" id='features'>Features</h2>
            <div className="row g-4 py-5 row-cols-1 row-cols-lg-3">
                {
                    features.map((feature, key) => <div key={key} className="col d-flex align-items-start">
                        <div className="icon-square bg-light text-dark flex-shrink-0 me-3">
                            {feature.img}
                        </div>
                        <div>
                            <h2>{feature.title}</h2>
                            <p>{feature.desc}</p>
                            {feature.buttons}
                        </div>
                    </div>)
                }
            </div>
        </Container>
    );
};

export default Feature;

/** Creates a Badge with currently installed package version. */
const VersionBadge = (name) => {
    const version = packageLock.packages['node_modules/' + name]?.version;
    return <Badge bg='info'>{version}</Badge>;
};
