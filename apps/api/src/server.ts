import "dotenv/config";
import app from "./app.js";

const PORT = process.env.PORT || 9000;

const starterServer = async (): Promise<void> => {
    try {
        const server =  app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error("Error starting server:", error);
        process.exit(1);
    }
};

void starterServer();