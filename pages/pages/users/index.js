import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Password } from 'primereact/password';
import { Toast } from 'primereact/toast';
import {Toolbar} from "primereact/toolbar";
import { classNames } from 'primereact/utils';
import {RadioButton} from "primereact/radiobutton";
import axios from "axios";
import {BASE_URL} from "../../auth/login/config";


const UserManagement = () => {
    const emptyUser = {
        name: '',
        email: '',
        password: '',
        passwordConfirm: '',
        role: '',
    }

    const [users, setUsers] = useState(null);
    const [userDialog, setUserDialog] = useState(false);
    const [deleteUserDialog, setDeleteUserDialog] = useState(false);
    const [user, setUser] = useState(emptyUser);
    const [selectedUsers, setSelectedUsers] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get(BASE_URL + '/users');
            console.log('Users:', response.data);
            setUsers(response.data.data);
        } catch (error) {
            if (error.response.status === 401) {
                toast.current.show({
                    severity: 'error',
                    summary: 'Unauthorized',
                    detail: 'Please login to access this page',
                    life: 3000
                });
            } else {
                toast.current.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'An error occurred while attempting to fetch users',
                    life: 3000
                });
            }
        }
    };

    const openNew = () => {
        setUser(emptyUser);
        setSubmitted(false);
        setUserDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setUserDialog(false);
    };

    const saveUser = async () => {
        setSubmitted(true);

        if (user.name && user.email && (!user.password || user.password.trim()) && user.role && user.role.trim()) {
            try {
                let response;

                if (user._id) {
                    console.log('Updating user:', user);
                    response = await axios.put(`${BASE_URL}/users/${user._id}`, user);
                    console.log(response)
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'User Updated', life: 3000 });
                } else {
                    console.log('Adding user:', user);
                    response = await axios.post(`${BASE_URL}/users`, user);
                    console.log(response)
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'User Created', life: 3000 });
                }

                const updatedUsers = [...users];
                const userIndex = findIndexById(user._id);
                if (userIndex !== -1) {
                    updatedUsers[userIndex] = response.data.data;
                } else {
                    updatedUsers.push(response.data.data);
                }

                setUsers(updatedUsers);
                setUserDialog(false);
                setUser(emptyUser);
            } catch (error) {
                if (error.response.status === 401) {
                    toast.current.show({
                        severity: 'error',
                        summary: 'Unauthorized',
                        detail: 'Please login to access this function',
                        life: 3000
                    });
                } else {
                    toast.current.show({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'An error occurred while attempting to save user',
                        life: 3000
                    });
                }
            }
        }
    };


    const editUser = selectedUser => {
        setUser({ ...selectedUser });
        setUserDialog(true);
    };

    const confirmDeleteUser = selectedUser => {
        setUser(selectedUser);
        setDeleteUserDialog(true);
    };

    const deleteUser = async () => {
        try {
            await axios.delete(`${BASE_URL}/users/${user._id}`);
            const updatedUsers = users.filter((val) => val._id !== user._id);
            setUsers(updatedUsers);
            setDeleteUserDialog(false);
            setUser(emptyUser);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'User Deleted', life: 3000 });
        } catch (error) {
            if (error.response.status === 401) {
                toast.current.show({
                    severity: 'error',
                    summary: 'Unauthorized',
                    detail: 'Please login to access this function',
                    life: 3000
                });
            } else {
                toast.current.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'An error occurred while attempting to delete user',
                    life: 3000
                });
            }
        }
    };

    const findIndexById = (id) => {
        return users.findIndex((user) => user._id === id);
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _user = { ...user };
        _user[`${name}`] = val;

        setUser(_user);
    };

    const onRoleChange = (e) => {
        let _user = { ...user };
        _user['role'] = e.value;
        setUser(_user);
    };


    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="New" icon="pi pi-plus" severity="sucess" className="mr-2" onClick={openNew} />
                </div>
            </React.Fragment>
        );
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <Button icon="pi pi-pencil" severity="success" rounded className="mr-2" onClick={() => editUser(rowData)} />
                <Button icon="pi pi-trash" severity="warning" rounded onClick={() => confirmDeleteUser(rowData)} />
            </>
        );
    };

    const roleBodyTemplate = (rowData) => {
        return (
            <>
                <span className={classNames('product-badge', 'status-' + rowData.role.toLowerCase())}>{rowData.role}</span>
            </>
        );
    }

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Manage Users</h5>
        </div>
    );



    const userDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button
                label="Save"
                icon="pi pi-check"
                className="p-button-text"
                onClick={saveUser}
                disabled={!user.name || !user.email || (!user._id && (!user.password || !user.passwordConfirm)) || !user.role}
            />
        </>
    );

    const deleteUserDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={() => setDeleteUserDialog(false)} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteUser} />
        </>
    );


    return (
        <div className="grid user-management">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={users}
                        dataKey="_id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} users"
                        emptyMessage="No users found."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column style={{ width: '3rem' }} />
                        <Column body={actionBodyTemplate} />
                        <Column field="name" header="Name" sortable />
                        <Column field="email" header="Email" sortable />
                        <Column field="role" header="Role" sortable />
                    </DataTable>

                    <Dialog
                        visible={userDialog}
                        style={{ width: '450px' }}
                        header="User Details"
                        modal
                        className="p-fluid"
                        footer={userDialogFooter}
                        onHide={hideDialog}
                    >
                        <div className="field">
                            <label htmlFor="name">Name</label>
                            <InputText
                                id="name"
                                value={user?.name || ''}
                                onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !user.name })} />
                            {submitted && !user.name && <small className="p-invalid">Name is required.</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="email">Email</label>
                            <InputText
                                id="email"
                                value={user?.email || ''}
                                onChange={(e) => onInputChange(e, 'email')} required autoFocus className={classNames({ 'p-invalid': submitted && !user.email })} />
                            {submitted && !user.email && <small className="p-invalid">Email is required.</small>}
                        </div>

                        {!user._id && ( // Only show password fields when adding a new user
                            <>
                                <div className="field">
                                    <label htmlFor="password">Password</label>
                                    <Password
                                        id="password"
                                        value={user?.password || ''}
                                        onChange={(e) => onInputChange(e, 'password')}
                                        required
                                        autoFocus
                                        className={classNames({ 'p-invalid': submitted && !user.password })}
                                    />
                                    {submitted && !user.password && <small className="p-invalid">Password is required.</small>}
                                </div>

                                <div className="field">
                                    <label htmlFor="confirm-password">Confirm Password</label>
                                    <Password
                                        id="confirm-password"
                                        value={user?.passwordConfirm || ''}
                                        onChange={(e) => onInputChange(e, 'passwordConfirm')}
                                        required
                                        autoFocus
                                        className={classNames({ 'p-invalid': submitted && !user.passwordConfirm })}
                                    />
                                    {submitted && !user.passwordConfirm && <small className="p-invalid">Please confirm your password.</small>}
                                </div>
                            </>
                        )}

                        <div className="field">
                            <label htmlFor="role">Role</label>
                            <div className="formgrid grid">
                                <div className="field-radiobutton col-6">
                                    <RadioButton inputId="category1" name="category" value="admin" onChange={onRoleChange} checked={user.role === 'admin'} />
                                    <label htmlFor="category1">Admin</label>
                                </div>
                                <div className="field-radiobutton col-6">
                                    <RadioButton inputId="category2" name="category" value="user" onChange={onRoleChange} checked={user.role === 'user'} />
                                    <label htmlFor="category2">User</label>
                                </div>
                            </div>
                        </div>
                    </Dialog>

                    <Dialog
                        visible={deleteUserDialog}
                        style={{ width: '450px' }}
                        header="Confirm"
                        modal
                        footer={deleteUserDialogFooter}
                        onHide={() => setDeleteUserDialog(false)}
                    >
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {user && (
                                <span>
                  Are you sure you want to delete <b>{user.name}</b>?
                </span>
                            )}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;
