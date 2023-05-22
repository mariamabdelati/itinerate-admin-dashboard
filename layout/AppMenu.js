import React, { useContext } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import Link from 'next/link';

const AppMenu = () => {
    const { layoutConfig } = useContext(LayoutContext);

    const model = [
        {
            label: 'Pages',
            items: [
                {
                    label: 'Login',
                    icon: 'pi pi-fw pi-sign-in',
                    to: '/auth/login'
                },
                // {
                //     label: 'Auth',
                //     icon: 'pi pi-fw pi-user',
                //     items: [
                //         {
                //             label: 'Login',
                //             icon: 'pi pi-fw pi-sign-in',
                //             to: '/auth/login'
                //         },
                //     //     {
                //     //         label: 'Access Denied',
                //     //         icon: 'pi pi-fw pi-lock',
                //     //         to: '/auth/access'
                //     //     }
                //     // ]
                // },
                {
                    label: 'Users',
                    icon: 'pi pi-fw pi-users',
                    to: '/pages/users'
                },
                {
                    label: 'Trips',
                    icon: 'pi pi-fw pi-ticket',
                    to: '/pages/trips'
                }
            ]
        },
    ];

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => {
                    return !item.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                })}
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
