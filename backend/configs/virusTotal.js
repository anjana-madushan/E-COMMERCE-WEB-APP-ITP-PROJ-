

const nvt = require('node-virustotal');
const defaultTimedInstance = nvt.makeAPI().setKey('ecb86998e912731671976c2dbeedab917f18e8a9f99462395d02cd2a9cafd96c');

function ScanUrl(url) {
  return new Promise((resolve, reject) => {
    // Perform the URL lookup directly using the URL
    defaultTimedInstance.urlLookup(url, function (err, res) {
      if (err) {
        console.log('Error during URL scan:', err);
        return reject(err);
      }

      let road;
      try {
        road = JSON.parse(res);
      } catch (parseError) {
        console.log('Error parsing response:', parseError);
        return reject(parseError);
      }

      // Ensure we have analysis results to work with
      if (!road.data || !road.data.attributes || !road.data.attributes.last_analysis_results) {
        console.log('No analysis results found for the URL.');
        return resolve(false);
      }

      // Access specific antivirus engine results, e.g., Kaspersky
      const kasperskyResult = road.data.attributes.last_analysis_results.Kaspersky.result;

      // Determine if the URL is clean
      if (kasperskyResult !== "clean") {
        console.log("It is not clean");
        resolve(false);
      } else {
        console.log("The link is safe");
        resolve(true);
      }
    });
  });
}

exports.default = ScanUrl