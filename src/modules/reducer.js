import _ from "lodash";
import firestore from "./firestore.js";

// The reducer is an internal middle man that handles passing information from each
// of the various components to something called the store.  The store is basically a
// global state.  This state is also never edited, but rather a copy is made, updated
// and then replaced.  This leads to come key benefits that escacpe me, but its "standard
// practice" do still handle the reducer this way.

// The reducer is "called" by using a dispatch.  These have a type and a payload.
// The type is matched against a switch statement to perform a state update.
// The payload is used to information from a component to the reducer and then save to store

const ADDRESS_TEMPLATE = {
    name: "",
    line_1: "",
    line_2: "",
    city: "",
    state: "",
    zip: "",
    special_instructions: "",
};

const VEHICLE_TEMPLATE = {
    make_model: "",
    year: "",
    color: "",
    lp: "",
    insp_date: "",
    insur_provider: "",
    insur_policy: "",
    insur_exp: "",
    insur_coverage: 0,
    seats: 0,
    special: "",
};

const VOL_HOURS_TEMPLATE = (day="monday") => {return {
    day: day,
    start: "",
    end: ""
}
};

const BLANK_PROFILE = {
    user_type: "",
    village_id: "",
    status: "active",
    personal_info: {
        first_name: "",
        last_name: "",
        email: "",
        phone_mobile: "",
        phone_home: "",
        preferred_communication: "",
        language: []
    },
    emergency_contact: {
        first_name: "",
        last_name: "",
        email: "",
        phone_mobile: "",
        phone_home: "",
        preferred_communication: "",
        relationship: ""
    },
    caregiver: {
        first_name: "",
        last_name: "",
        email: "",
        phone_mobile: "",
        phone_home: "",
        preferred_communication: "",
    },
    addresses: [ADDRESS_TEMPLATE,],
    accommodations: {
        allergies: "",
        mobility_aid: "",
        smoke_preference: "",
        special: ""
    },
    vehicles: [VEHICLE_TEMPLATE,],
    volunteer_hours: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].map(day => VOL_HOURS_TEMPLATE(day)),
    driver_specific: {
        vetting: "",
    },
};

const BLANK_RIDE = {
    ride_id: "",
    rider: {
        first_name: "",
            last_name: "",
            id: "",
    },
    driver_1: {
        first_name: "",
            last_name: "",
            id: "",
    },
    //Optional second driver
    driver_2: {
        first_name: "",
            last_name: "",
            id: "",
    },
    locations: {
        pickup: {
            address: "",
            time: "",
            special: "",
            geolocation: ""
        },
        dropoff: {
            address: "",
            special: "",
            geolocation: ""
        },
        //Optional return location
        return: {
            address: "",
            time: "",
            special: "",
            geolocation: ""
        },
    },
    ride_data: {
        distance: "",
        time_total: "",
        traffic: "",
        date: "",
    }
};

const initialState = {
    authenticated: false,
    loaded: false,
    operator: {
        first_name: "",
        last_name: "",
        village_id: "",
    },
    ridebreakdown: {
        id: "",
        rider: '',
        driver: '',
        pickup: "",
        dropoff: ""
    },
    villages: {},
    users: {},
    rides: {},
    // This is
    active_profile: _.cloneDeep(BLANK_PROFILE),
    active_ride: _.cloneDeep(BLANK_RIDE),
};

//The authentication should be cached for a period of time
//so that reloading the page doesnt mess us up.

const VillageReducer = (state = initialState, action) => {
    switch (action.type) {
    case "dump_store": {
        console.log(state);
        return state;
    }

    case "authenticate": {
        let newState = _.cloneDeep(state);
        newState.authenticated = true;
        newState.operator.first_name = action.payload.first_name;
        newState.operator.last_name = action.payload.last_name;
        newState.operator.village_id = action.payload.village_id;
        return newState;
    }

    case "logout": {
        let newState = _.cloneDeep(state);
        newState.authenticated = false;
        newState.loaded = false;
        return newState;
    }

    case "load": {
        let newState = _.cloneDeep(state);
        switch (action.payload.tag) {
            case "loaded":
                newState.loaded = action.payload.data;
                break;
            case "villages":
                newState.villages = action.payload.data;
                break;
            case "users":
                newState.users = action.payload.data;
                break;
            case "rides":
                newState.rides = action.payload.data;
                break;
            default:
        }
        return newState;
    }

    case "add_user": {
        let newState = _.cloneDeep(state);
        newState.users.push(action.payload);
        return newState;
    }

    case "clear_active_profile": {
        let newState = _.cloneDeep(state);
        newState.active_profile = _.cloneDeep(BLANK_PROFILE);
        return newState;
    }

    case "set_active_user": {
        let newState = _.cloneDeep(state);
        newState.active_profile = action.payload;
        return newState;
    }

    case "ridebreakdown": {
        let newState = _.cloneDeep(state);
        newState.ridebreakdown = action.payload;
        return newState;
    }

    case "registration": {
        let newState = _.cloneDeep(state);
            switch (action.payload.id) {
                case "user_type":
                    newState.active_profile[action.payload.id] = action.payload.value;
                    break;
                case "village_id":
                    newState.active_profile[action.payload.id] = action.payload.value;
                    break;
                case "add_address":
                    newState.active_profile.addresses.push(_.cloneDeep(ADDRESS_TEMPLATE));
                    break;
                case "remove_address":
                    newState.active_profile.addresses.splice(action.payload.value, 1);
                    break;
                case "add_vehicle":
                    newState.active_profile.vehicles.push(_.cloneDeep(VEHICLE_TEMPLATE));
                    break;
                case "remove_vehicle":
                    newState.active_profile.vehicles.splice(action.payload.value, 1);
                    break;
                case "add_vol_hours":
                    newState.active_profile.volunteer_hours.push(_.cloneDeep(VOL_HOURS_TEMPLATE()));
                    break;
                case "remove_vol_hours":
                    newState.active_profile.volunteer_hours.splice(action.payload.value, 1);
                    break;
                default:
                    if (action.payload.type === "addresses") {
                        newState.active_profile[action.payload.type][action.payload.id.split("|")[0]][action.payload.id.split("|")[1]] = action.payload.value;
                    } else if (action.payload.type === "vehicles") {
                        newState.active_profile[action.payload.type][action.payload.id.split("|")[0]][action.payload.id.split("|")[1]] = action.payload.value;
                    } else if (action.payload.type === "volunteer_hours") {
                        newState.active_profile[action.payload.type][action.payload.id.split("|")[0]][action.payload.id.split("|")[1]] = action.payload.value;
                    } else {
                        newState.active_profile[action.payload.type][action.payload.id] = action.payload.value;
                    }
                    break;
            }
        return newState;
    }

    case "scheduler": {
        let newState = _.cloneDeep(state);
        if (action.payload.type === "date"){
            newState.active_ride.ride_data.date = action.payload.value;
        } else {
            newState.active_ride.locations[action.payload.type][action.payload.field] = action.payload.value;
        }
        return newState;
    }

    case "set_ride_participant": {
        let newState = _.cloneDeep(state);
        if (action.payload.type === "rider"){
            newState.active_ride.rider.first_name = action.payload.user.personal_info.first_name;
            newState.active_ride.rider.last_name = action.payload.user.personal_info.last_name;
            newState.active_ride.rider.id = action.payload.user.id;
        } else if (action.payload.type === "driver_1") {
            newState.active_ride.driver_1.first_name = action.payload.user.personal_info.first_name;
            newState.active_ride.driver_1.last_name = action.payload.user.personal_info.last_name;
            newState.active_ride.driver_1.id = action.payload.user.id;
        } else if (action.payload.type === "driver_2") {
            newState.active_ride.driver_1.first_name = action.payload.user.personal_info.first_name;
            newState.active_ride.driver_1.last_name = action.payload.user.personal_info.last_name;
            newState.active_ride.driver_1.id = action.payload.user.id;
        }
        return newState;
    }

    case "user_update": {
        let newState = _.cloneDeep(state);

        let index = newState.active_profile.id;
        if (index) {
            newState.users[index] = newState.active_profile;
            firestore.collection("users").doc(newState.active_profile.id).update(newState.active_profile);
        }

        return newState;
    }

    case "user_deactivate": {
        let newState = _.cloneDeep(state);
        newState.active_profile.status = "inactive";
        //Now edit the local copy, then update the DB:
        //Find the user in newState.users
        let index = newState.users.findIndex((i) => {return i.id === newState.active_profile.id});
        if (index >= 0) {
            newState.users[index].status = "inactive";
        }

        //Update Firestore
        firestore.collection("users").doc(newState.active_profile.id).update({
            status: "inactive"
        });

        return newState;
    }
    case "user_activate": {
        let newState = _.cloneDeep(state);
        newState.active_profile.status = "active";
        //Now edit the local copy, then update the DB:
        //Find the user in newState.users
        let index = newState.users.findIndex((i) => {return i.id === newState.active_profile.id});
        if (index >= 0) {
            newState.users[index].status = "active";
        }

        //Update the FS document
        firestore.collection("users").doc(newState.active_profile.id).update({
            status: "active"
        });

        return newState;
    }
    case "user_perma_delete": {
        let newState = _.cloneDeep(state);
        //Now edit the local copy, then update the DB:
        let id_to_delete = newState.active_profile.id;
        let index = newState.users.findIndex((i) => {return i.id === newState.active_profile.id});
        if (index >= 0) {
            delete newState.users[index];
        }

        newState.active_profile = _.cloneDeep(BLANK_PROFILE);

        //Delete the record (document) in firestore
        firestore.collection("users").doc(id_to_delete).delete();

        return newState;
    }

    default:
        return state;
    }
};

export default VillageReducer;
