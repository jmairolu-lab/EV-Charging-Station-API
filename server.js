const express = require("express");
const cors = require("cors");

const app = express();

const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());


// =====================================================
// SAMPLE CHARGING STATIONS
// =====================================================

let stations = [
    {
        id: 1,
        name: "GreenCharge Station",
        location: "Mangalore",
        address: "Kottara, Mangalore",
        chargingType: "Fast Charging",
        availableSlots: 4,
        totalSlots: 6,
        status: "Available",
        operatingHours: "24 Hours",
        contact: "9876543210"
    },
    {
        id: 2,
        name: "EV Power Hub",
        location: "Mangalore",
        address: "Bejai, Mangalore",
        chargingType: "DC Fast Charging",
        availableSlots: 2,
        totalSlots: 5,
        status: "Available",
        operatingHours: "6 AM - 11 PM",
        contact: "9876543211"
    },
    {
        id: 3,
        name: "EcoCharge Point",
        location: "Mangalore",
        address: "Hampankatta, Mangalore",
        chargingType: "AC Charging",
        availableSlots: 0,
        totalSlots: 4,
        status: "Full",
        operatingHours: "24 Hours",
        contact: "9876543212"
    }
];


// =====================================================
// SAMPLE BOOKINGS
// =====================================================

let bookings = [
    {
        id: 1,
        userName: "Papu",
        contact: "9876543210",
        stationId: 1,
        vehicleNumber: "KA19AB1234",
        vehicleType: "Car",
        date: "2026-08-17",
        time: "10:00 AM",
        chargingType: "Fast Charging",
        status: "Confirmed"
    }
];


// =====================================================
// HOME / HEALTH CHECK
// =====================================================

app.get("/", (req, res) => {
    res.json({
        message: "EV Charging Station API is running successfully"
    });
});


// =====================================================
// STATION APIs
// =====================================================

// GET - Get all stations
app.get("/api/stations", (req, res) => {
    res.json({
        success: true,
        count: stations.length,
        stations: stations
    });
});


// GET - Get one station by ID
app.get("/api/stations/:id", (req, res) => {

    const id = parseInt(req.params.id);

    const station = stations.find(station => station.id === id);

    if (!station) {
        return res.status(404).json({
            success: false,
            message: "Charging station not found"
        });
    }

    res.json({
        success: true,
        station: station
    });
});


// POST - Add a new station
app.post("/api/stations", (req, res) => {

    const {
        name,
        location,
        address,
        chargingType,
        availableSlots,
        totalSlots,
        status,
        operatingHours,
        contact
    } = req.body;

    if (
        !name ||
        !location ||
        !address ||
        !chargingType ||
        availableSlots === undefined ||
        totalSlots === undefined ||
        !status ||
        !operatingHours ||
        !contact
    ) {
        return res.status(400).json({
            success: false,
            message: "Please provide all station details"
        });
    }

    const newStation = {
        id: stations.length > 0
            ? stations[stations.length - 1].id + 1
            : 1,
        name,
        location,
        address,
        chargingType,
        availableSlots,
        totalSlots,
        status,
        operatingHours,
        contact
    };

    stations.push(newStation);

    res.status(201).json({
        success: true,
        message: "Charging station added successfully",
        station: newStation
    });
});


// PUT - Update a station
app.put("/api/stations/:id", (req, res) => {

    const id = parseInt(req.params.id);

    const stationIndex = stations.findIndex(
        station => station.id === id
    );

    if (stationIndex === -1) {
        return res.status(404).json({
            success: false,
            message: "Charging station not found"
        });
    }

    const {
        name,
        location,
        address,
        chargingType,
        availableSlots,
        totalSlots,
        status,
        operatingHours,
        contact
    } = req.body;

    stations[stationIndex] = {
        id: id,
        name: name || stations[stationIndex].name,
        location: location || stations[stationIndex].location,
        address: address || stations[stationIndex].address,
        chargingType:
            chargingType || stations[stationIndex].chargingType,
        availableSlots:
            availableSlots !== undefined
                ? availableSlots
                : stations[stationIndex].availableSlots,
        totalSlots:
            totalSlots !== undefined
                ? totalSlots
                : stations[stationIndex].totalSlots,
        status: status || stations[stationIndex].status,
        operatingHours:
            operatingHours || stations[stationIndex].operatingHours,
        contact: contact || stations[stationIndex].contact
    };

    res.json({
        success: true,
        message: "Charging station updated successfully",
        station: stations[stationIndex]
    });
});


// DELETE - Delete a station
app.delete("/api/stations/:id", (req, res) => {

    const id = parseInt(req.params.id);

    const stationIndex = stations.findIndex(
        station => station.id === id
    );

    if (stationIndex === -1) {
        return res.status(404).json({
            success: false,
            message: "Charging station not found"
        });
    }

    const deletedStation = stations.splice(stationIndex, 1);

    res.json({
        success: true,
        message: "Charging station deleted successfully",
        station: deletedStation[0]
    });
});


// =====================================================
// BOOKING APIs
// =====================================================

// GET - Get all bookings
app.get("/api/bookings", (req, res) => {

    res.json({
        success: true,
        count: bookings.length,
        bookings: bookings
    });
});


// GET - Get one booking by ID
app.get("/api/bookings/:id", (req, res) => {

    const id = parseInt(req.params.id);

    const booking = bookings.find(
        booking => booking.id === id
    );

    if (!booking) {
        return res.status(404).json({
            success: false,
            message: "Booking not found"
        });
    }

    res.json({
        success: true,
        booking: booking
    });
});


// POST - Create a new booking
app.post("/api/bookings", (req, res) => {

    const {
        userName,
        contact,
        stationId,
        vehicleNumber,
        vehicleType,
        date,
        time,
        chargingType
    } = req.body;

    if (
        !userName ||
        !contact ||
        !stationId ||
        !vehicleNumber ||
        !vehicleType ||
        !date ||
        !time ||
        !chargingType
    ) {
        return res.status(400).json({
            success: false,
            message: "Please provide all booking details"
        });
    }

    const station = stations.find(
        station => station.id === parseInt(stationId)
    );

    if (!station) {
        return res.status(404).json({
            success: false,
            message: "Charging station not found"
        });
    }

    if (station.availableSlots <= 0) {
        return res.status(400).json({
            success: false,
            message: "No charging slots available at this station"
        });
    }

    const newBooking = {
        id: bookings.length > 0
            ? bookings[bookings.length - 1].id + 1
            : 1,
        userName,
        contact,
        stationId: parseInt(stationId),
        vehicleNumber,
        vehicleType,
        date,
        time,
        chargingType,
        status: "Confirmed"
    };

    bookings.push(newBooking);

    // Reduce available slot after booking
    station.availableSlots--;

    if (station.availableSlots === 0) {
        station.status = "Full";
    }

    res.status(201).json({
        success: true,
        message: "Booking created successfully",
        booking: newBooking
    });
});


// PUT - Update booking
app.put("/api/bookings/:id", (req, res) => {

    const id = parseInt(req.params.id);

    const bookingIndex = bookings.findIndex(
        booking => booking.id === id
    );

    if (bookingIndex === -1) {
        return res.status(404).json({
            success: false,
            message: "Booking not found"
        });
    }

    const {
        userName,
        contact,
        stationId,
        vehicleNumber,
        vehicleType,
        date,
        time,
        chargingType,
        status
    } = req.body;

    bookings[bookingIndex] = {
        id: id,
        userName: userName || bookings[bookingIndex].userName,
        contact: contact || bookings[bookingIndex].contact,
        stationId:
            stationId || bookings[bookingIndex].stationId,
        vehicleNumber:
            vehicleNumber || bookings[bookingIndex].vehicleNumber,
        vehicleType:
            vehicleType || bookings[bookingIndex].vehicleType,
        date: date || bookings[bookingIndex].date,
        time: time || bookings[bookingIndex].time,
        chargingType:
            chargingType || bookings[bookingIndex].chargingType,
        status: status || bookings[bookingIndex].status
    };

    res.json({
        success: true,
        message: "Booking updated successfully",
        booking: bookings[bookingIndex]
    });
});


// DELETE - Delete/cancel booking
app.delete("/api/bookings/:id", (req, res) => {

    const id = parseInt(req.params.id);

    const bookingIndex = bookings.findIndex(
        booking => booking.id === id
    );

    if (bookingIndex === -1) {
        return res.status(404).json({
            success: false,
            message: "Booking not found"
        });
    }

    const deletedBooking = bookings.splice(bookingIndex, 1)[0];

    // Return the charging slot
    const station = stations.find(
        station => station.id === deletedBooking.stationId
    );

    if (station) {

        station.availableSlots++;

        if (station.availableSlots > 0) {
            station.status = "Available";
        }
    }

    res.json({
        success: true,
        message: "Booking cancelled successfully",
        booking: deletedBooking
    });
});


// =====================================================
// START SERVER
// =====================================================

app.listen(PORT, () => {
    console.log(`EV Charging Station API running on http://localhost:${PORT}`);
});