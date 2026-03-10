import cron from "node-cron";
import { Order } from "../../DB/Models/order.js";
import { orderStatus } from "../enums/enums.js";

export const initCleanupCron = () => {
  // Run every night at 2:00 AM
  cron.schedule("0 2 * * *", async () => {
    console.log("Running nightly cleanup cron job...");
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    try {
      const result = await Order.updateMany(
        {
          orderStatus: orderStatus.pending,
          createdAt: { $lt: twentyFourHoursAgo },
        },
        {
          $set: { orderStatus: orderStatus.cancelled },
        },
      );

      console.log(
        `Cleanup cron finished. Cancelled ${result.modifiedCount} pending orders.`,
      );
    } catch (error) {
      console.error("Error in cleanup cron job:", error);
    }
  });
};
