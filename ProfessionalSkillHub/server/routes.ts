import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { z } from "zod";
import { 
  insertCourseSchema, 
  insertUserCourseSchema, 
  insertSubscriptionSchema,
  purchaseTypeSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  setupAuth(app);

  // Get all courses
  app.get("/api/courses", async (_req, res) => {
    try {
      const courses = await storage.getAllCourses();
      res.json(courses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch courses" });
    }
  });

  // Get a single course by ID
  app.get("/api/courses/:id", async (req, res) => {
    try {
      const courseId = parseInt(req.params.id);
      const course = await storage.getCourse(courseId);
      
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      
      res.json(course);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch course" });
    }
  });

  // Get user's purchased courses
  app.get("/api/user/courses", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const userId = req.user!.id;
      const courses = await storage.getUserCourses(userId);
      res.json(courses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user courses" });
    }
  });

  // Check if user has subscription
  app.get("/api/user/subscription", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const userId = req.user!.id;
      const subscription = await storage.getUserSubscription(userId);
      res.json(subscription);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user subscription" });
    }
  });

  // Purchase route (handles both one-time purchases and subscriptions)
  app.post("/api/purchase", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const purchaseType = purchaseTypeSchema.parse(req.body.purchaseType);
      const userId = req.user!.id;
      
      if (purchaseType === "course") {
        // One-time course purchase
        const courseId = z.number().parse(req.body.courseId);
        const course = await storage.getCourse(courseId);
        
        if (!course) {
          return res.status(404).json({ message: "Course not found" });
        }
        
        const userCourse = await storage.createUserCourse({
          userId,
          courseId,
        });
        
        res.status(201).json(userCourse);
      } else {
        // Subscription purchase
        const subscriptionEnd = new Date();
        
        if (purchaseType === "monthly") {
          subscriptionEnd.setMonth(subscriptionEnd.getMonth() + 1);
        } else if (purchaseType === "annual") {
          subscriptionEnd.setFullYear(subscriptionEnd.getFullYear() + 1);
        }
        
        const subscription = await storage.createSubscription({
          userId,
          planType: purchaseType,
          startDate: new Date(),
          endDate: subscriptionEnd,
          active: true
        });
        
        res.status(201).json(subscription);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid purchase data", errors: error.errors });
      }
      
      res.status(500).json({ message: "Failed to process purchase" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
