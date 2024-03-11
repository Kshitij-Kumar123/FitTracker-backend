const { connectToCluster } = require("./dbHelper")

async function returnColl() {
    try {
        const client = await connectToCluster();
        const db = client.db("WinterProjectDB");
        const collection = db.collection("Fitness-Collection");
        return collection;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

exports.createRecord = async (req, res) => {
    // Implementation to create a new Record
    try {
        const collection = await returnColl();
        const exerciseDocument = { ...req.body };
        await collection.insertOne(exerciseDocument);
        res.status(201).json({
            "message": "Record inserted"
        })
    } catch (err) {
        console.log(err);
        throw err;
    }
};

exports.getRecord = async (req, res) => {
    // Implementation to get Record details of the user's exercise
    try {
        const { id } = req.params;
        const collection = await returnColl();
        const allExercises = await collection.find({ id }).toArray();
        res.status(200).json(allExercises);
    } catch (err) {
        console.log(err);
        throw err;
    }
};

exports.updateRecord = async (req, res) => {
    // Implementation to update Record information
    try {
        const collection = await returnColl();
        const { id } = req.params;
        const updatedExercises = await collection.updateMany(
            { id },
            { $set: { ...req.body } }
        )

        res.status(200).json({
            message: "Record updated",
            updated: updatedExercises
        })
    } catch (err) {
        console.log(err);
        throw err;
    }
};

exports.deleteRecord = async (req, res) => {
    // Implementation to delete a user
    try {
        const collection = await returnColl();
        const { id } = req.params;
        await collection.deleteMany({ id })
        res.status(200).json({
            message: "Record deleted"
        })
    } catch (err) {
        console.log(err);
        throw err;
    }
};
