import mongoose, {Schema} from "mongoose";

const apiTestSchema = new Schema({
    testData: {
        type: String,
        trim: true,
        required: [true, "Heading part 1 is must!"]
    },
},{timestamps: true})

export const ApiTest = mongoose.model("ApiTest", apiTestSchema);
