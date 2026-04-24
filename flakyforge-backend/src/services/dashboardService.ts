import mongoose from "mongoose"

export const DashboardService = {
  async getSummary(userId: string) {
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const today = new Date();
    today.setHours(0,0,0,0);
  }
}