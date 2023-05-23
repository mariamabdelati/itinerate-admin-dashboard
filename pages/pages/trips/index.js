import React, {useEffect, useRef, useState} from 'react';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {InputText} from 'primereact/inputtext';
import {Button} from 'primereact/button';
import {Dialog} from 'primereact/dialog';
import {InputNumber} from "primereact/inputnumber";
import {Toast} from 'primereact/toast';
import {Toolbar} from "primereact/toolbar";
import {classNames} from 'primereact/utils';
import {RadioButton} from "primereact/radiobutton";
import axios from "axios";
import {BASE_URL} from "../../auth/login/config";
import {InputTextarea} from "primereact/inputtextarea";


const TripManagement = () => {
    const emptyTrip = {
        destinationName: '',
        location: '',
        continent: '',
        language: '',
        nationality: '',
        images: [],
        description: '',
        flightCost: 0,
        accommodationCost: 0,
        mealCost: 0,
        visaCost: 0,
        currencyCode: '',
        transportationModes: [],
        transportationCost: 0,
        visaIsRequired: false,
        visaRequirements: '',
        timeZone: '',
        bestTimeToVisit: '',
        bestPlacesToVisit: [],
    }

    const [trips, setTrips] = useState(null);
    const [tripDialog, setTripDialog] = useState(false);
    const [deleteTripDialog, setDeleteTripDialog] = useState(false);
    const [trip, setTrip] = useState(emptyTrip);
    const [selectedTrips, setSelectedTrips] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        fetchTrips();
    }, []);

    const fetchTrips = async () => {
        try {
            const response = await axios.get(BASE_URL + '/trips');
            console.log('Trips:', response.data);
            setTrips(response.data.data);
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
                    detail: 'An error occurred while fetching trips',
                    life: 3000
                });
            }
        }
    };

    const openNew = () => {
        setTrip(emptyTrip);
        setSubmitted(false);
        setTripDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setTripDialog(false);
    };

    const saveTrip = async () => {
        setSubmitted(true);

        if (trip.destinationName && trip.location && trip.continent && trip.language &&
            trip.nationality && trip.images && trip.description && trip.flightCost &&
            trip.accommodationCost && trip.mealCost && trip.visaCost && trip.currencyCode &&
            trip.transportationModes && trip.transportationCost &&
            trip.visaRequirements && trip.timeZone && trip.bestTimeToVisit && trip.bestPlacesToVisit) {
            try {
                let response;

                if (trip._id) {
                    console.log('Updating trip:', trip);
                    response = await axios.put(`${BASE_URL}/trips/${trip._id}`, trip);
                    console.log(response)
                    toast.current.show({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Trip Updated',
                        life: 3000
                    });
                } else {
                    console.log('Adding trip:', trip);
                    response = await axios.post(`${BASE_URL}/trips`, trip);
                    console.log(response)
                    toast.current.show({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Trip Created',
                        life: 3000
                    });
                }

                const updatedTrips = [...trips];
                const tripIndex = findIndexById(trip._id);
                if (tripIndex !== -1) {
                    updatedTrips[tripIndex] = response.data.data;
                } else {
                    updatedTrips.push(response.data.data);
                }

                setTrips(updatedTrips);
                setTripDialog(false);
                setTrip(emptyTrip);
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
                        detail: 'Error saving trip',
                        life: 3000
                    });
                }
            }
        }
    };


    const editTrip = selectedTrip => {
        setTrip({...selectedTrip});
        setTripDialog(true);
    };

    const confirmDeleteTrip = selectedTrip => {
        setTrip(selectedTrip);
        setDeleteTripDialog(true);
    };

    const deleteTrip = async () => {
        try {
            await axios.delete(`${BASE_URL}/trips/${trip._id}`);
            const updatedTrips = trips.filter((val) => val._id !== trip._id);
            setTrips(updatedTrips);
            setDeleteTripDialog(false);
            setTrip(emptyTrip);
            toast.current.show({severity: 'success', summary: 'Successful', detail: 'Trip Deleted', life: 3000});
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
                    detail: 'Error deleting trip',
                    life: 3000
                });
            }
        }
    };

    const findIndexById = (id) => {
        return trips.findIndex((trip) => trip._id === id);
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _trip = {...trip};
        _trip[`${name}`] = val;

        setTrip(_trip);
    };

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _trip = {...trip};
        _trip[`${name}`] = val;

        setTrip(_trip);
    };

    const onContinentChange = (e) => {
        let _trip = {...trip};
        _trip['continent'] = e.value;
        setTrip(_trip);
    };

    const onVisaChange = (e) => {
        let _trip = {...trip};
        _trip['visaIsRequired'] = e.value;
        setTrip(_trip);
    };

    const onListChange = (e, name) => {
        let value = e.target.value.split(',').map(place => place.trim()); // Split the input value by comma and trim whitespace
        let _trip = { ...trip };
        _trip[`${name}`] = value;
        setTrip(_trip);
    };



    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="New" icon="pi pi-plus" severity="sucess" className="mr-2" onClick={openNew}/>
                </div>
            </React.Fragment>
        );
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <Button icon="pi pi-pencil" severity="success" rounded className="mr-2"
                        onClick={() => editTrip(rowData)}/>
                <Button icon="pi pi-trash" severity="warning" rounded onClick={() => confirmDeleteTrip(rowData)}/>
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Manage Trips</h5>
        </div>
    );


    const tripDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog}/>
            <Button
                label="Save"
                icon="pi pi-check"
                className="p-button-text"
                onClick={saveTrip}
                disabled={!trip.destinationName || !trip.location || !trip.continent || !trip.language ||
                    !trip.nationality || !trip.images || !trip.description || !trip.flightCost ||
                    !trip.accommodationCost || !trip.mealCost || !trip.visaCost || !trip.currencyCode ||
                    !trip.transportationModes || !trip.transportationCost || !trip.visaIsRequired ||
                    !trip.visaRequirements || !trip.timeZone || !trip.bestTimeToVisit || !trip.bestPlacesToVisit}
            />
        </>
    );

    const deleteTripDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={() => setDeleteTripDialog(false)}/>
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteTrip}/>
        </>
    );


    return (
        <div className="grid trip-management">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast}/>
                    <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={trips}
                        dataKey="_id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} trips"
                        emptyMessage="No trips found."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column style={{width: '3rem'}}/>
                        <Column body={actionBodyTemplate}/>
                        <Column field="destinationName" header="Destination Name" sortable/>
                        <Column field="location" header="Location" sortable/>
                        <Column field="continent" header="Continent" sortable/>
                        <Column field="language" header="Language" sortable/>
                        <Column field="nationality" header="Nationality" sortable/>
                        <Column field="description" header="Description" sortable/>
                        <Column field="flightCost" header="Flight Cost" sortable/>
                        <Column field="accommodationCost" header="Accommodation Cost" sortable/>
                        <Column field="mealCost" header="Meal Cost" sortable/>
                        <Column field="visaCost" header="Visa Cost" sortable/>
                        <Column field="currencyCode" header="Currency Code" sortable/>
                        <Column field="transportationModes" header="Transportation Modes" sortable/>
                        <Column field="transportationCost" header="Transportation Cost" sortable/>
                        <Column field="visaIsRequired" header="Visa Is Required" sortable/>
                        <Column field="visaRequirements" header="Visa Requirements" sortable/>
                        <Column field="timeZone" header="Time Zone" sortable/>
                        <Column field="bestTimeToVisit" header="Best Time To Visit" sortable/>
                        <Column field="bestPlacesToVisit" header="Best Places To Visit" sortable/>
                    </DataTable>

                    <Dialog
                        visible={tripDialog}
                        style={{width: '450px'}}
                        header="Trip Details"
                        modal
                        className="p-fluid"
                        footer={tripDialogFooter}
                        onHide={hideDialog}
                    >

                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="destinationName">Destination Name</label>
                                <InputText
                                    id="destinationName"
                                    value={trip?.destinationName || ''}
                                    onChange={(e) => onInputChange(e, 'destinationName')} required autoFocus
                                    className={classNames({'p-invalid': submitted && !trip.destinationName})}/>
                                {submitted && !trip.destinationName &&
                                    <small className="p-invalid">Destination Name is required.</small>}
                            </div>
                            <div className="field col">
                                <label htmlFor="location">Location</label>
                                <InputText
                                    id="location"
                                    value={trip?.location || ''}
                                    onChange={(e) => onInputChange(e, 'location')} required autoFocus
                                    className={classNames({'p-invalid': submitted && !trip.location})}/>
                                {submitted && !trip.location && <small className="p-invalid">Location is required.</small>}
                            </div>
                        </div>

                        <div className="field">
                            <label htmlFor="continent">Continent</label>
                            <div className="formgrid grid">
                                <div className="field-radiobutton col-6">
                                    <RadioButton inputId="category1" name="category" value="africa"
                                                 onChange={onContinentChange} checked={trip.continent.toLowerCase() === 'africa'}/>
                                    <label htmlFor="category1">Africa</label>
                                </div>
                                <div className="field-radiobutton col-6">
                                    <RadioButton inputId="category2" name="category" value="asia"
                                                 onChange={onContinentChange} checked={trip.continent.toLowerCase() === 'asia'}/>
                                    <label htmlFor="category2">Asia</label>
                                </div>
                                <div className="field-radiobutton col-6">
                                    <RadioButton inputId="category3" name="category" value="europe"
                                                 onChange={onContinentChange} checked={trip.continent.toLowerCase() === 'europe'}/>
                                    <label htmlFor="category3">Europe</label>
                                </div>
                                <div className="field-radiobutton col-6">
                                    <RadioButton inputId="category4" name="category" value="north america"
                                                 onChange={onContinentChange}
                                                 checked={trip.continent.toLowerCase() === 'north america'}/>
                                    <label htmlFor="category4">North America</label>
                                </div>
                                <div className="field-radiobutton col-6">
                                    <RadioButton inputId="category5" name="category" value="south america"
                                                 onChange={onContinentChange}
                                                 checked={trip.continent.toLowerCase() === 'south america'}/>
                                    <label htmlFor="category5">South America</label>
                                </div>
                                <div className="field-radiobutton col-6">
                                    <RadioButton inputId="category6" name="category" value="australia"
                                                 onChange={onContinentChange} checked={trip.continent.toLowerCase() === 'australia'}/>
                                    <label htmlFor="category6">Australia</label>
                                </div>
                                <div className="field-radiobutton col-6">
                                    <RadioButton inputId="category6" name="category" value="antarctica"
                                                 onChange={onContinentChange}
                                                 checked={trip.continent.toLowerCase() === 'antarctica'}/>
                                    <label htmlFor="category6">Antarctica</label>
                                </div>
                            </div>
                        </div>
                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="language">Language</label>
                                <InputText
                                    id="language"
                                    value={trip?.language || ''}
                                    onChange={(e) => onInputChange(e, 'language')} required autoFocus
                                    className={classNames({'p-invalid': submitted && !trip.language})}/>
                                {submitted && !trip.language &&
                                    <small className="p-invalid">Language is required.</small>}
                            </div>
                            <div className="field col">
                                <label htmlFor="nationality">Nationality</label>
                                <InputText
                                    id="nationality"
                                    value={trip?.nationality || ''}
                                    onChange={(e) => onInputChange(e, 'nationality')} required autoFocus
                                    className={classNames({'p-invalid': submitted && !trip.nationality})}/>
                                {submitted && !trip.nationality && <small className="p-invalid">Nationality is required.</small>}
                            </div>
                        </div>
                        <div className="field">
                            <label htmlFor="images">Image Links</label>
                            <InputText
                                id="images"
                                value={trip?.images.join(', ')} // Join the array values with a separator to display in the input field
                                onChange={(e) => onListChange(e, 'images')}
                                required
                                autoFocus
                                className={classNames({'p-invalid': submitted && !trip.images})}
                            />
                            {submitted && !trip.images && (
                                <small className="p-invalid">
                                    At least one image is required for the destination.
                                </small>
                            )}
                        </div>
                        <div className="field">
                            <label htmlFor="description">Description</label>
                            <InputTextarea
                                id="description"
                                value={trip?.description || ''}
                                onChange={(e) => onInputChange(e, 'description')} required autoFocus rows={3} cols={20}
                                className={classNames({'p-invalid': submitted && !trip.description})}/>
                            {submitted && !trip.description &&
                                <small className="p-invalid">Description is required.</small>}
                        </div>
                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="mealCost">Meal Cost</label>
                                <InputNumber id="mealCost" value={trip.mealCost}
                                             onValueChange={(e) => onInputNumberChange(e, 'mealCost')}
                                             mode="currency" currency="EGP" locale="en-EG"/>
                            </div>
                            <div className="field col">
                                <label htmlFor="visaCost">Visa Cost</label>
                                <InputNumber id="visaCost" value={trip.visaCost}
                                             onValueChange={(e) => onInputNumberChange(e, 'visaCost')}
                                             mode="currency" currency="EGP" locale="en-EG"/>
                            </div>
                            <div className="field col">
                                <label htmlFor="flightCost">Flight Cost</label>
                                <InputNumber id="flightCost" value={trip.flightCost}
                                             onValueChange={(e) => onInputNumberChange(e, 'flightCost')} mode="currency"
                                             currency="EGP" locale="en-EG"/>
                            </div>
                        </div>
                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="accommodationCost">Accommodation Cost</label>
                                <InputNumber id="accommodationCost" value={trip.accommodationCost}
                                             onValueChange={(e) => onInputNumberChange(e, 'accommodationCost')} mode="currency"
                                             currency="EGP" locale="en-EG"/>
                            </div>
                            <div className="field col">
                                <label htmlFor="transportationCost">Transportation Cost</label>
                                <InputNumber id="transportationCost" value={trip.transportationCost}
                                             onValueChange={(e) => onInputNumberChange(e, 'transportationCost')} mode="currency"
                                             currency="EGP" locale="en-EG"/>
                            </div>
                        </div>

                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="currencyCode">Currency Code</label>
                                <InputText
                                    id="currencyCode"
                                    value={trip?.currencyCode || ''}
                                    onChange={(e) => onInputChange(e, 'currencyCode')} required autoFocus
                                    className={classNames({'p-invalid': submitted && !trip.currencyCode})}/>
                                {submitted && !trip.currencyCode && <small className="p-invalid">Currency Code is required.</small>}
                            </div>
                            <div className="field col">
                                <label htmlFor="timeZone">Time Zone</label>
                                <InputText
                                    id="timeZone"
                                    value={trip?.timeZone || ''}
                                    onChange={(e) => onInputChange(e, 'timeZone')} required autoFocus
                                    className={classNames({'p-invalid': submitted && !trip.timeZone})}/>
                                {submitted && !trip.timeZone && <small className="p-invalid">Time Zone is required.</small>}
                            </div>

                        </div>
                        <div className="formgrid grid">
                        <div className="field col">
                            <label htmlFor="visaIsRequired">Is Visa Required?</label>
                            <div className="formgrid grid">
                                <div className="field-radiobutton col-6">
                                    <RadioButton inputId="category8" name="visaIsRequired" value={true}
                                                 onChange={onVisaChange} checked={trip.visaIsRequired === true}/>
                                    <label htmlFor="category8">True</label>
                                </div>
                                <div className="field-radiobutton col-6">
                                    <RadioButton inputId="category9" name="visaIsRequired" value={false}
                                                 onChange={onVisaChange} checked={trip.visaIsRequired === false}/>
                                    <label htmlFor="category9">False</label>
                                </div>
                            </div>
                        </div>
                            <div className="field col">
                                <label htmlFor="visaRequirements">Visa Requirements</label>
                                <InputText
                                    id="visaRequirements"
                                    value={trip?.visaRequirements || ''}
                                    onChange={(e) => onInputChange(e, 'visaRequirements')} required autoFocus
                                    className={classNames({'p-invalid': submitted && !trip.visaRequirements})}/>
                                {submitted && !trip.visaRequirements && <small className="p-invalid">Visa Requirements are required.</small>}
                            </div>
                        </div>
                        <div className="field">
                            <label htmlFor="transportationModes">Transportation Modes</label>
                            <InputText
                                id="transportationModes"
                                value={trip?.transportationModes.join(', ')} // Join the array values with a separator to display in the input field
                                onChange={(e) => onListChange(e, 'transportationModes')}
                                required
                                autoFocus
                                className={classNames({'p-invalid': submitted && !trip.transportationModes})}
                            />
                            {submitted && !trip.transportationModes && (
                                <small className="p-invalid">
                                    At least one transportation is required for the destination.
                                </small>
                            )}
                        </div>
                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="bestTimeToVisit">Best Time To Visit</label>
                                <InputText
                                    id="bestTimeToVisit"
                                    value={trip?.bestTimeToVisit || ''}
                                    onChange={(e) => onInputChange(e, 'bestTimeToVisit')} required autoFocus
                                    className={classNames({'p-invalid': submitted && !trip.bestTimeToVisit})}/>
                                {submitted && !trip.bestTimeToVisit &&
                                    <small className="p-invalid">Best Time To Visit is required.</small>}
                            </div>
                            <div className="field col">
                                <label htmlFor="bestPlacesToVisit">Best Places to Visit</label>
                                <InputText
                                    id="bestPlacesToVisit"
                                    value={trip?.bestPlacesToVisit.join(', ')} // Join the array values with a separator to display in the input field
                                    onChange={(e) => onListChange(e, 'bestPlacesToVisit')}
                                    required
                                    autoFocus
                                    className={classNames({'p-invalid': submitted && !trip.bestPlacesToVisit})}
                                />
                                {submitted && !trip.bestPlacesToVisit && (
                                    <small className="p-invalid">
                                        At least one best place to visit is required for the destination.
                                    </small>
                                )}
                            </div>
                        </div>
                    </Dialog>

                    <Dialog
                        visible={deleteTripDialog}
                        style={{width: '450px'}}
                        header="Confirm"
                        modal
                        footer={deleteTripDialogFooter}
                        onHide={() => setDeleteTripDialog(false)}
                    >
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{fontSize: '2rem'}}/>
                            {trip && (
                                <span>
                  Are you sure you want to delete <b>{trip.destinationName}, {trip.location}</b>?
                </span>
                            )}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default TripManagement;
