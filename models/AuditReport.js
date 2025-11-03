import mongoose from "mongoose";

const AuditReportSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  url: { type: String, required: true },
  keyword: { type: String },
  auditResult: { type: Object, required: true },
  createdAt: { type: Date, default: () => new Date() },
});

export default mongoose.model("AuditReport", AuditReportSchema);
