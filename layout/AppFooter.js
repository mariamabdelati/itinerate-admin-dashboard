import React, { useContext } from 'react';
import { LayoutContext } from './context/layoutcontext';

const AppFooter = () => {
    const { layoutConfig } = useContext(LayoutContext);

    return (
        <div className="layout-footer">
            <img src={`/layout/images/logo.svg`} alt="Logo" height="20" className="mr-2" />
        </div>
    );
};

export default AppFooter;
