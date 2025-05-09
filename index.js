const express = require('express');
const app = express();
const cookieParser = require("cookie-parser")
const cors = require("cors")
require('dotenv').config({path:"./config.env"})


const PORT = process.env.PORT || 8800;
const UserRoutes = require('./Routes/user');
const MedicineRoutes = require('./Routes/medicine')
const FacilityRoutes = require("./Routes/facility");
const HospitalRoutes = require("./Routes/nearByHospital")
const GallaryRoutes = require("./Routes/gallary")
const NotificationRoutes = require("./Routes/notification")
const HistoryRoutes = require("./Routes/history");

require('./conn');

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials:true,
    origin: ['https://collage-dispensary.vercel.app', 'https://collage-disp-frontend.vercel.app'],
}))


app.use('/api/auth',UserRoutes);
app.use('/api/medicine',MedicineRoutes);
app.use('/api/facility',FacilityRoutes);
app.use('/api/hospital',HospitalRoutes);
app.use('/api/gallary',GallaryRoutes)
app.use('/api/notification',NotificationRoutes)
app.use('/api/history',HistoryRoutes)

app.listen(PORT,()=>{
    console.log("Backend is running on Port",PORT);
})