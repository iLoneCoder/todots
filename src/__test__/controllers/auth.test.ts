import { NextFunction, Request, Response } from "express";
import { signUp } from "../../controller/auth.controller";
import { hashPassword } from "../../utils/auth/auth";
import { User } from "../../db";
import apiCallLimiter from "../../utils/auth/apiCallLimiter";
import AppError from "../../utils/auth/appError";
// Mock Response
const mockResponse = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
} as unknown as Response;

const next: NextFunction = jest.fn();

// Correct mock of the `hashPassword` function
jest.mock("../../utils/auth/auth", () => ({
    hashPassword: jest.fn().mockResolvedValueOnce("hashed_password")
}));

jest.mock("../../utils/auth/apiCallLimiter", () => {
    apiCallLimiter: jest.fn()
})

// jest.mock("../../utils/auth/appError")

jest.mock("../../db")

describe("Authorization", () => {
    it("create user successfully", async () => {
        const mockRequest = {
            body: {
                email: "test@mail.com",
                password: "123456",
                confirmPassword: "123456"
            }
        } as unknown as Request;

        const findOneMock = jest.spyOn(User, "findOne").mockResolvedValueOnce(null)
        const createMock = jest.spyOn(User, "create").mockResolvedValueOnce({
            email: "email"
        } as unknown as User)
        await signUp(mockRequest, mockResponse, next);

        expect(mockRequest.body.email).not.toBeFalsy();
        expect(mockRequest.body.password).not.toBeFalsy();
        expect(mockRequest.body.confirmPassword).not.toBeFalsy();
        expect(mockRequest.body.password).toEqual(mockRequest.body.confirmPassword);
        expect(hashPassword).toHaveBeenCalled();
        expect(findOneMock).toHaveBeenCalled()
        expect(createMock).toHaveBeenCalled()
        expect(mockResponse.status).toHaveBeenCalledWith(201)
        expect(mockResponse.json).toHaveBeenCalledWith({
            status: "success", 
            data: {email: "email"}})
    });

    it("Create new user should fail, because of empty email", async () => {
        const mockRequest = {
            body: {
                email: "",
                password: "123456",
                confirmPassword: "123456"
            }
        } as unknown as Request

        await signUp(mockRequest, mockResponse, next)
        expect(mockRequest.body.email).toBeFalsy()
        expect(mockRequest.body.password).not.toBeFalsy()
        expect(mockRequest.body.confirmPassword).not.toBeFalsy()
        expect(next).toHaveBeenCalledWith(new AppError("provide email", 400))
    })

    it("Create new user should fail, because of empty password", async () => {
        const mockRequest = {
            body: {
                email: "test",
                password: "",
                confirmPassword: "password"
            }
        } as unknown as Request

        await signUp(mockRequest, mockResponse, next)
        expect(mockRequest.body.email).not.toBeFalsy()
        expect(mockRequest.body.password).toBeFalsy()
        expect(mockRequest.body.confirmPassword).not.toBeFalsy()
        expect(next).toHaveBeenCalledWith(new AppError("provide password", 400))
    })

    it("create new user should fail, because of password and confirm password missmatch", async () => {
        const mockRequest = {
            body: {
                email: "email",
                password: "pas1",
                confirmPassword: "pas2"
            }
        } as unknown as Request

        await signUp(mockRequest, mockResponse, next)
        expect(mockRequest.body.email).not.toBeFalsy()
        expect(mockRequest.body.password).not.toBeFalsy()
        expect(mockRequest.body.confirmPassword).not.toBeFalsy()
        expect(mockRequest.body.password).not.toEqual(mockRequest.body.confirmPassword)
        expect(next).toHaveBeenCalledWith(new AppError("password and confirmPassword must match", 400))
    })

    it("create user fails, because findOne method fails", async () => {
        const mockRequest = {
            body: {
                email: "email",
                password: "pas1",
                confirmPassword: "pas1"
            }
        } as unknown as Request

        const findOneMock = jest.spyOn(User, "findOne").mockImplementationOnce(() => Promise.reject(new Error("failed to find")))
        await signUp(mockRequest, mockResponse, next)
        expect(hashPassword).toHaveBeenCalled()
        expect(findOneMock).toHaveBeenCalled()
        expect(next).toHaveBeenCalledWith(new Error("failed to find"))
    })

    it("create user fails, because email dublication", async () => {
        const mockRequest = {
            body: {
                email: "email",
                password: "pas1",
                confirmPassword: "pas1"
            }
        } as unknown as Request

        const findOneMock = jest.spyOn(User, "findOne").mockResolvedValueOnce({email: "test"} as unknown as User)
        await signUp(mockRequest, mockResponse, next)
        expect(hashPassword).toHaveBeenCalled()
        expect(findOneMock).toHaveBeenCalled()
        expect(next).toHaveBeenCalledWith(new Error("email is unique"))
    })

    it("create user fails, bacause create method fail", async () => {
        const mockRequest = {
            body: {
                email: "email",
                password: "pas1",
                confirmPassword: "pas1"
            }
        } as unknown as Request

        const findOneMock = jest.spyOn(User, "findOne").mockResolvedValueOnce(null)
        const createMock = jest.spyOn(User, "create").mockImplementationOnce(() => Promise.reject(new Error("failed to create")))
        await signUp(mockRequest, mockResponse, next)
        expect(hashPassword).toHaveBeenCalled()
        expect(findOneMock).toHaveBeenCalled()
        expect(createMock).toHaveBeenCalled()
        expect(next).toHaveBeenCalledWith(new Error("failed to create"))
    })
});