const router = require("express").Router();
const {
  addData,
  getData,
  getPageViewsLineChart,
  getPageViewsBarChart,
  getPageViewsHeatmap,
  getTotalRecords,
  getPieChartForComponents,
  getScatterPlotData,
  getHistogramData,
} = require("../controllers/analyticsController");

const authMiddleware = require("../middlewares/authMiddleware");

router.get("/", (req, res) => {
  res.send("Hello World!");
});
router.post("/data", addData);
router.get("/data", authMiddleware, getData);
router.get("/api/page-views/line-chart", authMiddleware, getPageViewsLineChart);
router.get("/api/page-views/bar-chart", authMiddleware, getPageViewsBarChart);
router.get("/api/page-views/heatmap", authMiddleware, getPageViewsHeatmap);
router.get("/api/total-records", authMiddleware, getTotalRecords);
router.get("/api/pie-chart", authMiddleware, getPieChartForComponents);
router.get("/api/scatter-plot", authMiddleware, getScatterPlotData);
router.get("/api/histogram", authMiddleware, getHistogramData);

module.exports = router;
