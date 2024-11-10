import request, { Request, Response } from "supertest";
import { type Express } from "express";
import createApp from "../createApp";
import { db_config, db_drop } from "../db_setup_test";

// import sequelize from "../db/sequelize";



describe("test auth endpoints", () => {
    let app: Express
    
    beforeAll(async () => {
        await db_config()
        app = await createApp()
    })

    const userCreds = {
        email: "test@gmail.com",
        password: "123456"
    }

    it("user should be created", async () => {
        const response = await request(app).post("/api/v1/auth/signup")
        .send({
            email: userCreds.email,
            password: userCreds.password,
            confirmPassword: userCreds.password
        })

        expect(response.statusCode).toBe(201)
    })

    it("user should log in and check the status", async () => {
        const response = await request(app).post("/api/v1/auth/login")
            .send({
                email: userCreds.email,
                password: userCreds.password
            })
            .then((res) => {
                return request(app).get("/api/v1/auth/status")
                    .set({
                        "authorization": `Bearer ${res.body.token}`
                    })                    
            })

        expect(response.status).toBe(200)
    })

    afterAll(async () => {
        await db_drop()
    })
})

