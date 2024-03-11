const { connectToCluster } = require("./helpers")

async function returnColl() {
    try {
        const client = await connectToCluster();
        const db = client.db("WinterProjectDB");
        // TODO: get this service its own collection
        const collection = db.collection("User-Collection");
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
        const allExercises = await collection.find({ userId: id }).toArray();
        res.status(200).json({ ...allExercises });
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
            { userId: id },
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
    // Implementation to delete a user's exercise
    try {
        const collection = await returnColl();
        const { id } = req.params;
        await collection.deleteMany({ userId: id })
        res.status(200).json({
            message: "Record deleted"
        })
    } catch (err) {
        console.log(err);
        throw err;
    }
};
