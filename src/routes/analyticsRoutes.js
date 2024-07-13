const router = require("express").Router();
const {
  addData,
  getData,
  getPageViewsLineChart,
  getPageViewsBarChart,
  getPageViewsHeatmap,
} = require("../controllers/analyticsController");

router.post("/data", addData);
router.get("/data", getData);
router.get("/api/page-views/line-chart", getPageViewsLineChart);
router.get("/api/page-views/bar-chart", getPageViewsBarChart);
router.get("/api/page-views/heatmap", getPageViewsHeatmap);

module.exports = router;
