import { promises as fs } from "fs"
import path from "path"

export async function deleteFiles(fileNames: string[]) {
    try {
        const basePath = path.join(__dirname, "../../")
        const files = await fs.readdir(path.join(basePath, "static"))
        
        const filesToDelete = files.filter(file => fileNames.some(fileName => fileName.includes(file)))
        const filesPathToDelete = filesToDelete.map(file => path.join(basePath, "static", file))
        const unlinkPromises = filesPathToDelete.map(filePath => fs.unlink(filePath))
        const results = await Promise.allSettled(unlinkPromises)

        const errors = results.filter(res => res.status === "rejected")

        if (errors.length > 0){
            console.log("files not deleted: ", errors)
        }
    } catch (error) {
        throw error
    }
}