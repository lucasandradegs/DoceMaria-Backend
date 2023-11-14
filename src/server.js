require("express-async-errors")
require("dotenv/config")

const express = require("express")
const routes = require("./routes")
const cookieParser = require("cookie-parser")
const AppError = require("./utils/AppError")
const database = require("./database/sqlite")
const uploadConfig = require("./configs/upload")

const cors = require("cors")


const app = express()

app.use(cookieParser())

app.use(cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173/"],
    credentials: true
  }));

app.use(express.json())

app.use("/files", express.static(uploadConfig.UPLOADS_FOLDER))

app.use(routes)

database()

app.use((error, req, res, next) => {
    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
            status: "error",
            message: error.message
        })
    }

    console.log(error)

    return res.status(500).json({
        status: "error",
        message: "Internal server Error"
    })
})

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`))