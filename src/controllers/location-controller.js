const Locations = require("../models/locations");
const dotenv = require("dotenv");
// const mongoose = require("mongoose");

dotenv.config();

exports.submitContribution = async (req, res) => {
    try {
        console.log("req.body", req.body);
        let {
            location_name,
            download_speed,
            upload_speed,
            connection_stability
        } = req.body
        let singleLocation = await Locations.findOne({ location_name });
        console.log("singleLocation", singleLocation);
        if (!singleLocation) {
            console.log("Location not found, creating new one");
            let stabilityValue = connection_stability === "Poor" ? 1 :
                connection_stability === "Fair" ? 2 :
                    connection_stability === "Good" ? 3 : 4;
            let newLocation = new Locations({
                location_name,
                average_upload_speed: upload_speed,
                average_download_speed: download_speed,
                connection_stability: connection_stability,
                upload_speed_entries: [upload_speed],
                download_speed_entries: [download_speed],
                connection_stability_entries: [stabilityValue],
                deleted: false
            });
            console.log("newLocation", newLocation);
            await newLocation.save();
            res.json({
                message: "Location contribution submitted successfully",
                data: {
                    newLocation: {
                        location_name,
                        average_upload_speed: upload_speed,
                        average_download_speed: download_speed,
                        connection_stability: connection_stability
                    }
                }
            })
        } else {
            console.log("Location found, updating existing one");
            let averageUploadSpeed = (singleLocation.average_upload_speed * singleLocation.upload_speed_entries.length + upload_speed) / (singleLocation.upload_speed_entries.length + 1);
            let averageDownloadSpeed = (singleLocation.average_download_speed * singleLocation.download_speed_entries.length + download_speed) / (singleLocation.download_speed_entries.length + 1);
            let initialStabilityValue = singleLocation.connection_stability === "Poor" ? 1 :
                singleLocation.connection_stability === "Fair" ? 2 :
                    singleLocation.connection_stability === "Good" ? 3 : 4;
            let stabilityValue = connection_stability === "Poor" ? 1 :
                connection_stability === "Fair" ? 2 :
                    connection_stability === "Good" ? 3 : 4;
            let averageConnectionStability = Math.round((initialStabilityValue * singleLocation.connection_stability_entries.length + stabilityValue) / (singleLocation.connection_stability_entries.length + 1));
            await Locations.findOneAndUpdate(
                { location_name },
                {
                    average_upload_speed: Math.round(averageUploadSpeed * 100) / 100,
                    average_download_speed: Math.round(averageDownloadSpeed * 100) / 100,
                    connection_stability: averageConnectionStability === 1 ? "Poor" :
                        averageConnectionStability === 2 ? "Fair" :
                            averageConnectionStability === 3 ? "Good" : "Excellent",
                    $push: {
                        upload_speed_entries: upload_speed,
                        download_speed_entries: download_speed,
                        connection_stability_entries: stabilityValue
                    }
                }
            );
            res.json({
                message: "Location contribution submitted successfully",
                data: {
                    newLocation: {
                        location_name,
                        average_upload_speed: averageUploadSpeed,
                        average_download_speed: averageDownloadSpeed,
                        connection_stability: averageConnectionStability
                    }
                }
            })
        }
    } catch (error) {
        console.log("An error has occurred", error);
        res.send("An error has occurred")
    }
}
