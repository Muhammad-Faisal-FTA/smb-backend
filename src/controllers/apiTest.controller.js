import {asyncHandler} from "../utils/asyncHandler.utils.js";
import {ApiTest} from "../models/apiTest.model.js";
import { ApiError } from "../utils/ApiError.utils.js";
import { ApiResponse } from "../utils/ApiResponce.utils.js";

const apiTestWritingData = asyncHandler(async (req, res) => {
    const {testData}  = req.body;
    if(!testData){
        throw new ApiError(409, "test has some error !")
    }
// write the data
    const writedTestData = await  ApiTest.findOneAndUpdate({}, 
        {
            testData
        }, {
            new: true, //Return the updated document instead of the original one before the update
            upsert: true, //If no matching document is found, create one using the update values
            runValidators: true
        })

    res.status(200)
    .json(
        new ApiResponse(
            200, 
            {
              testData
            },
            "🟢 writed test data successfully! 😊"
        )
    )
});

const  apiTestReadingData = asyncHandler(async (req, res) => {
    const testData = await ApiTest.findOne();
    res.status(200)
    .json(
        new ApiResponse(
            200,
            
            testData,
            
            "🟢 Reade test data successfully! 😊"
        )
    )
})

export {apiTestWritingData, apiTestReadingData}