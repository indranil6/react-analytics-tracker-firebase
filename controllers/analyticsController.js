const { firestore, firebase } = require("../config/firebase");
const formatDate = require("../utils/formatDate");
const {
  REACT_ANALYTICS_TRACKING_COLLECTION,
} = require("../constants/collections");

const addData = async (req, res) => {
  try {
    const data = req.body;
    const docRef = await firestore
      .collection(REACT_ANALYTICS_TRACKING_COLLECTION)
      .add(data);
    res.status(201).send({ id: docRef.id });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const getData = async (req, res) => {
  try {
    const { appName } = req;
    const snapshot = await firestore
      .collection(REACT_ANALYTICS_TRACKING_COLLECTION)
      .where("appName", "==", appName)
      .get();

    if (snapshot.empty) {
      res.status(404).send({ message: "No matching documents found" });
      return;
    }

    const results = [];
    snapshot.forEach((doc) => {
      results.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).send(results);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const getPageViewsLineChart = async (req, res) => {
  try {
    const { appName } = req;
    const snapshot = await firestore
      .collection(REACT_ANALYTICS_TRACKING_COLLECTION)
      .where("appName", "==", appName)
      .get();
    const data = {};

    console.log("Fetching data from Firestore...");

    snapshot.forEach((doc) => {
      const payload = doc.data();
      const date = formatDate(new Date(payload.events[0].timestamp));

      if (!data[date]) {
        data[date] = 0;
      }
      data[date] += 1; // Increment the page view count for the date
    });

    console.log("Fetching data successful. Sending response...");
    res.json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Internal Server Error");
  }
};

const getPageViewsBarChart = async (req, res) => {
  try {
    const { appName } = req;
    const snapshot = await firestore
      .collection(REACT_ANALYTICS_TRACKING_COLLECTION)
      .where("appName", "==", appName)
      .get();
    const data = {};

    snapshot.forEach((doc) => {
      const payload = doc.data();
      const page = payload.pathname;

      if (!data[page]) {
        data[page] = 0;
      }
      data[page] += 1; // Increment the page view count for the page
    });

    res.json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Internal Server Error");
  }
};

const getPageViewsHeatmap = async (req, res) => {
  try {
    const { appName } = req;
    const snapshot = await firestore
      .collection(REACT_ANALYTICS_TRACKING_COLLECTION)
      .where("appName", "==", appName)
      .get();
    const data = {};

    snapshot.forEach((doc) => {
      const payload = doc.data();
      const date = formatDate(new Date(payload.events[0].timestamp));
      const hour = new Date(payload.events[0].timestamp).getHours();

      if (!data[date]) {
        data[date] = Array(24).fill(0);
      }
      data[date][hour] += 1; // Increment the page view count for the hour
    });

    res.json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Internal Server Error");
  }
};
const getTotalRecords = async (req, res) => {
  try {
    const { appName } = req;
    const snapshot = await firestore
      .collection(REACT_ANALYTICS_TRACKING_COLLECTION)
      .where("appName", "==", appName)
      .get();
    let totalRecords = snapshot.size;
    let totalUniqueSessions = new Set();

    let totalEvents = 0;
    snapshot.forEach((doc) => {
      const payload = doc.data();
      totalEvents += payload.events.length;

      totalUniqueSessions.add(payload.sessionId);
    });
    res.json({
      totalRecords,
      totalEvents,
      totalUniqueSessions: totalUniqueSessions.size,
    });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};
const getPieChartForComponents = async (req, res) => {
  try {
    const { appName } = req;
    const snapshot = await firestore
      .collection(REACT_ANALYTICS_TRACKING_COLLECTION)
      .where("appName", "==", appName)
      .get();

    if (snapshot.empty) {
      res.status(404).send({ message: "No matching documents found" });
      return;
    }

    const componentInteractions = {};

    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data.events && Array.isArray(data.events)) {
        data.events.forEach((event) => {
          const { component } = event;
          if (componentInteractions[component]) {
            componentInteractions[component]++;
          } else {
            componentInteractions[component] = 1;
          }
        });
      }
    });

    const chartData = Object.keys(componentInteractions).map((component) => ({
      component,
      interactions: componentInteractions[component],
    }));

    res.status(200).send(chartData);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const getScatterPlotData = async (req, res) => {
  try {
    const { appName } = req;

    if (!appName) {
      res.status(400).send({ error: "Missing appName parameter" });
      return;
    }

    const snapshot = await firestore
      .collection(REACT_ANALYTICS_TRACKING_COLLECTION)
      .where("appName", "==", appName)
      .get();

    if (snapshot.empty) {
      res.status(404).send({ message: "No matching documents found" });
      return;
    }

    const scatterPlotData = [];

    snapshot.forEach((doc) => {
      const data = doc.data();
      data.events.forEach((event) => {
        scatterPlotData.push({
          timestamp: event.timestamp,
          scrollPosition: JSON.parse(event.data).scrollPosition,
        });
      });
    });

    res.status(200).send(scatterPlotData);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const getHistogramData = async (req, res) => {
  try {
    const { appName } = req;

    if (!appName) {
      res.status(400).send({ error: "Missing appName parameter" });
      return;
    }

    const snapshot = await firestore
      .collection(REACT_ANALYTICS_TRACKING_COLLECTION)
      .where("appName", "==", appName)
      .get();

    if (snapshot.empty) {
      res.status(404).send({ message: "No matching documents found" });
      return;
    }

    const histogramData = [];

    snapshot.forEach((doc) => {
      const data = doc.data();
      data.events.forEach((event) => {
        histogramData.push(JSON.parse(event.data).viewedPercentage);
      });
    });

    res.status(200).send(histogramData);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
module.exports = {
  addData,
  getData,
  getPageViewsLineChart,
  getPageViewsBarChart,
  getPageViewsHeatmap,
  getTotalRecords,
  getPieChartForComponents,
  getScatterPlotData,
  getHistogramData,
};
