const {firestore} = require("../../server");


exports.getRides = async (village_id) => {
    let querySnapshot;
    if (village_id === 'admin') {
        querySnapshot = await firestore.collection('rides').get()
    } else {
        querySnapshot = await firestore.collection('rides').where('village_id', '==', village_id).get();
    }
    return querySnapshot.docs.map(doc => {
        return {...doc.data(), id: doc.id}
    });
};


exports.getRide = async (village_id, ride_id) => {
    const doc = await firestore.collection('rides').doc(ride_id).get();
    if (!doc) {
        return {}
    }
    let data = doc.data();
    data = {...data, id: doc.id}
    if (village_id === 'admin') return data;
    if (data) {
        if (data.ride_data.village_id === village_id) {
            return data
        }
    }
    return {}
};

exports.getRidesByDate = async (village_id, date) => {
    let querySnapshot;
    if (village_id === 'admin') {
        querySnapshot = await firestore.collection('rides').where('date', '==', date).get();
    } else {
        querySnapshot = await firestore.collection('rides').where('village_id', '==', village_id).where('date', '==', date).get();
    }
    return querySnapshot.docs.map(doc => {
        return {...doc.data(), id: doc.id}
    });
};


exports.addRide = async (ride) => {
    return firestore.collection('rides').add(ride)
        .then(ref => {
            return ref.id
        })
        .catch((e) => {
            console.log(e);
            return false
        })
};

exports.removeRide = async (ride_id) => {
    return firestore.collection('rides').doc(ride_id).delete()
        .then(() => {
            return true
        })
        .catch((e) => {
            console.log(e);
            return false
        })
};

exports.updateRide = async (ride) => {
    return firestore.collection('rides').doc(ride.id).update(ride)
        .then(() => {
            return true
        })
        .catch((e) => {
            console.log(e);
            return false
        })
};
