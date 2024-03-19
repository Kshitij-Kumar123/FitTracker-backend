const { connectToCluster } = require("./helpers")
const mongoDB = require("mongodb");
const ObjectID = mongoDB.ObjectId;

async function returnColl() {
    try {
        const client = await connectToCluster();
        const db = client.db("WinterProjectDB");
        const collection = db.collection("Food-Collection");
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
        const document = { ...req.body };
        const newId = new ObjectID();
        document['id'] = newId;
        document['_id'] = newId;
        await collection.insertOne(document);
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
        const records = await collection.find({ userId: id }).toArray();
        // Check if records is not null or undefined
        if (records) {
            const groupedData = records
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .reduce((acc, item) => {
                    const date = item.date.split(',')[0];
                    if (!acc[date]) {
                        acc[date] = {};
                        acc[date]['items'] = [];
                    }
                    if (!acc[date]['totalCalories']) {
                        acc[date]['totalCalories'] = 0;
                    }
                    acc[date]['items'].push(item);
                    acc[date]['totalCalories'] += Number(item.calories )|| 0;
                    return acc;
                }, {});
                console.log(groupedData);
            res.status(200).json(groupedData);
        } else {
            res.status(404).json({ message: "No records found" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
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
