import createApp from "./createApp"

const app = createApp()

const PORT = process.env.PORT || 8000

app.listen(PORT, () => console.log(`Server listens to port: ${PORT}`))