import React, { forwardRef, useContext, useImperativeHandle, useRef } from 'react';
import { LayoutContext } from './context/layoutcontext';
import Link from 'next/link';

const AppTopbar = forwardRef((props, ref) => {
    const { onMenuToggle } = useContext(LayoutContext);
    const menubuttonRef = useRef(null);


    useImperativeHandle(ref, () => ({
        menubutton: menubuttonRef.current,
    }));

    return (
        <div className="layout-topbar">
            <Link href="/" className="layout-topbar-logo">
                <img src={`/layout/images/logo.svg`} height={'50px'} width={'150px'} widt={'true'} alt="logo" />
            </Link>
            <button ref={menubuttonRef} type="button" className="p-link layout-menu-button layout-topbar-button" onClick={onMenuToggle}>
                <i className="pi pi-bars" />
            </button>
        </div>
    );
});

export default AppTopbar;
