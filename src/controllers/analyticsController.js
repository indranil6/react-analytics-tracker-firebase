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
    const { domain, value } = req.query;
    const snapshot = await firestore
      .collection(REACT_ANALYTICS_TRACKING_COLLECTION)
      .where(domain, "==", value)
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
    const snapshot = await firestore
      .collection(REACT_ANALYTICS_TRACKING_COLLECTION)
      .get();
    const data = {};

    snapshot.forEach((doc) => {
      const payload = doc.data();
      const date = formatDate(new Date(payload.timestamp));

      if (!data[date]) {
        data[date] = 0;
      }
      data[date] += 1; // Increment the page view count for the date
    });

    res.json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Internal Server Error");
  }
};

const getPageViewsBarChart = async (req, res) => {
  try {
    const snapshot = await firestore
      .collection(REACT_ANALYTICS_TRACKING_COLLECTION)
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
    const snapshot = await firestore
      .collection(REACT_ANALYTICS_TRACKING_COLLECTION)
      .get();
    const data = {};

    snapshot.forEach((doc) => {
      const payload = doc.data();
      const date = formatDate(new Date(payload.timestamp));
      const hour = new Date(payload.timestamp).getHours();

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

module.exports = {
  addData,
  getData,
  getPageViewsLineChart,
  getPageViewsBarChart,
  getPageViewsHeatmap,
};
