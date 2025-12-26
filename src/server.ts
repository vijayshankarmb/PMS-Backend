import app from "./app";
import dotenv from 'dotenv';
import connectDB from "./config/db";

const startServer = async () => {

    dotenv.config();

    await connectDB();

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });

}

startServer();

