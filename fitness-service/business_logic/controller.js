const { connectToCluster } = require("./helpers")
const mongoDB = require("mongodb");

/*
    Schema for exercises/activities of a user
    {
        id: <hash_id>
        name: String, 
        date: Datetime,
        reps: Integer,
        duration: Integer (in mins)
        category: String,
        weight: Integer 
        weightUnit: kg or lb
        speed: Integer,
        speedUnit: kph or mph
        usefulLinks: [string of urls],
        calorieBurned: Integer,
        extraNotes: [strings or dict of notes],
        userId: hash_id,
        // add more if needed 
    }

*/

const ObjectID = mongoDB.ObjectId;

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
        console.log("Creating a record");
        const collection = await returnColl();
        const exerciseDocument = { ...req.body };
        const newId = new ObjectID();
        exerciseDocument['id'] = newId;
        exerciseDocument['_id'] = newId;
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
        res.status(200).json({ ...allExercises });
    } catch (err) {
        console.log(err);
        throw err;
    }
};

exports.getUserRecord = async (req, res) => {
    try {
        const { id } = req.params;
        const collection = await returnColl();
        const activities = await collection.find({ userId: id }).toArray();
        // Categorize activities by date
        const activitiesByDate = activities.reduce((acc, activity) => {
            const { date } = activity;
            const activityDate = new Date(date);
            const formattedDate = activityDate.toISOString().split('T')[0]; // Extract date part only

            acc[formattedDate] = acc[formattedDate] || [];
            acc[formattedDate].push(activity);
            return acc;
        }, {});

        // Categorize activities by category within each date category
        const activitiesByDateAndCategory = {};
        Object.entries(activitiesByDate).forEach(([date, activities]) => {
            activitiesByDateAndCategory[date] = activities.reduce((acc, activity) => {
                const { category } = activity;
                acc[category] = acc[category] || [];
                acc[category].push(activity);
                return acc;
            }, {});
        });

        const twoWeeksAgo = new Date();
        twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

        const lastTwoWeeksActivities = {};

        Object.keys(activitiesByDateAndCategory).forEach(date => {
            const dateActivities = activitiesByDateAndCategory[date];
            const activityDate = new Date(date);
            if (activityDate > twoWeeksAgo) {
                lastTwoWeeksActivities[date] = dateActivities;
            }
        });

        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        let stats = {
            week1: {},
            week2: {}
        };

        Object.keys(lastTwoWeeksActivities).forEach(date => {
            const categories = lastTwoWeeksActivities[date];
            const whichWeek = new Date(date) >= oneWeekAgo ? 'week2' : 'week1';

            Object.keys(categories).forEach(category => {
                const activities = categories[category];

                // Ensure the nested objects are initialized
                if (!stats[whichWeek][category]) {
                    stats[whichWeek][category] = {};
                }


                if (category === "Cardio") {
                    if (!stats[whichWeek]['Cardio']) {
                        stats[whichWeek]['Cardio'] = {
                            'moveMins': 0,
                            'distanceCovered': 0
                        };
                    }

                    activities.forEach(activity => {
                        // Check if activity.duration and activity.distance are valid numbers
                        if (typeof activity.duration === 'number' && !isNaN(activity.duration)) {
                            stats[whichWeek]['Cardio']['moveMins'] = (stats[whichWeek]['Cardio']['moveMins'] || 0) + activity.duration;
                        }

                        if (typeof activity.distance === 'number' && !isNaN(activity.distance)) {
                            stats[whichWeek]['Cardio']['distanceCovered'] = (stats[whichWeek]['Cardio']['distanceCovered'] || 0) + activity.distance;
                        }
                    });

                } else {
                    activities.forEach(activity => {

                        if (!stats[whichWeek][category][activity.name]) {
                            stats[whichWeek][category][activity.name] = {
                                totalWeight: 0,
                                reps: 0,
                                count: 0 // Count the number of instances of each workout
                            };
                        }
                        // Accumulate total weight and count for each workout
                        stats[whichWeek][category][activity.name].totalWeight += activity.weight || 0;
                        stats[whichWeek][category][activity.name].reps += activity.reps || 0;
                        stats[whichWeek][category][activity.name].count++;
                    });
                }
            });
        });

        // Calculate average weight for each workout
        Object.keys(stats).forEach(week => {
            Object.keys(stats[week]).forEach(category => {
                if (category !== "Cardio") {
                    Object.keys(stats[week][category]).forEach(workout => {
                        const workoutStats = stats[week][category][workout];
                        if (workoutStats.count > 0) {
                            workoutStats.avgWeight = workoutStats.totalWeight / workoutStats.count;
                        }
                    });
                }
            });
        });

        // Calculate improvement stats
        // Initialize improvementStats
        let improvementStats = {};

        // Iterate over categories in week2
        Object.keys(stats.week2).forEach(category => {
            // Initialize improvement stats for the category
            improvementStats[category] = {};

            // Iterate over workouts in each category
            Object.keys(stats.week2[category]).forEach(workout => {
                // Check if there are stats for the same workout in both weeks
                if (stats.week1[category] && stats.week1[category][workout] && stats.week2[category] && stats.week2[category][workout]) {
                    const week1Stats = stats.week1[category][workout];
                    const week2Stats = stats.week2[category][workout];
                    // Iterate over each metric in the workout stats
                    Object.keys(week2Stats).forEach(metric => {
                        // Check if the metric exists in both weeks and if there's improvement
                        if (week1Stats.hasOwnProperty(metric)) {
                            // Calculate improvement
                            const improvement = week2Stats[metric] - week1Stats[metric];
                            const percentageImprovement = (improvement / week1Stats[metric]) * 100;
                            // Store improvement stats
                            improvementStats[category][workout] = improvementStats[category][workout] || {};
                            improvementStats[category][workout][metric] = {
                                improvement,
                                percentageImprovement
                            };
                        }
                    });
                }
            });
        });



        res.status(200).json({
            activities: activitiesByDateAndCategory,
            stats: stats,
            improvementStats: improvementStats
        });
    } catch (err) {
        console.log(err);
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
    // Implementation to delete a user's exercise
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
